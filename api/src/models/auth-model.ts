import type { User } from "~/db/drizzle/schema.js"
import type { IdentityRepository } from "~/repositories/identity-repository.js"
import type { UserRepository } from "~/repositories/user-repository.js"
import type { AuthProvider } from "~/services/auth-providers/auth-provider.js"
import type { RefreshTokenPayload } from "~/types.js"

import jwt from "jsonwebtoken"
import { JWT_SECRET } from "~/config/env.js"
import { Result } from "~/lib/Result.js"

export class AuthModel {
  private userRepo: UserRepository
  private authProvider: AuthProvider
  private identityRepo: IdentityRepository

  constructor({
    userRepo,
    authProvider,
    identityRepo,
  }: {
    userRepo: UserRepository
    authProvider: AuthProvider
    identityRepo: IdentityRepository
  }) {
    this.userRepo = userRepo
    this.authProvider = authProvider
    this.identityRepo = identityRepo
  }

  async auth(
    code: string
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const payloadResult = await this.authProvider.getUser(code)

    if (!payloadResult.success) {
      return Result.fail(new Error("Code is not valid"))
    }

    const payload = payloadResult.data
    const identity = await this.identityRepo.findBySub(payload.sub)

    const user = await (async () => {
      if (identity) {
        const userFound = await this.userRepo.findById(identity.userId)

        if (!userFound) {
          throw new Error("User not found for the given identity", {
            cause: { identity },
          })
        }

        return userFound
      }

      const newUser = await this.userRepo.create(payload)
      await this.identityRepo.create({
        sub: payload.sub,
        provider: payload.provider,
        userId: newUser.id,
      })

      return newUser
    })()

    const accessToken = this.signAccessToken(user)
    const refreshToken = this.signRefreshToken(user.id)

    return Result.ok({ accessToken, refreshToken })
  }

  async generateAccessToken(refreshToken: string): Promise<string> {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as RefreshTokenPayload
    const user = await this.userRepo.findById(decoded.userId)

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
