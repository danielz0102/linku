import type { User } from "~/db/drizzle/schema.js"
import type { UserRepository } from "~/repositories/user-repository.js"
import type { AuthService } from "~/services/auth-services/auth-service.js"
import type { RefreshTokenPayload } from "~/types.js"

import jwt from "jsonwebtoken"
import { JWT_SECRET } from "~/config/env.js"
import { Result } from "~/lib/Result.js"

export class AuthModel {
  constructor(
    private repo: UserRepository,
    private authService: AuthService
  ) {}

  async auth(
    idToken: string
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const payload = await this.authService.verifyToken(idToken)

    if (!payload.success) {
      return Result.fail(new Error("Token is not valid"))
    }

    const user = await (async () => {
      const existingUser = await this.repo.findByEmail(payload.data.email)
      return existingUser ?? this.repo.create(payload.data)
    })()

    const accessToken = this.signAccessToken(user)
    const refreshToken = this.signRefreshToken(user.id)

    return Result.ok({ accessToken, refreshToken })
  }

  async generateAccessToken(refreshToken: string): Promise<string> {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as RefreshTokenPayload
    const user = await this.repo.findById(decoded.userId)

    if (!user) {
      throw new Error("User not found for the provided refresh token", {
        cause: {
          userId: decoded.userId,
        },
      })
    }

    return this.signAccessToken(user)
  }

  private signAccessToken(user: User): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "15m" })
  }

  private signRefreshToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "30d",
    })
  }
}
