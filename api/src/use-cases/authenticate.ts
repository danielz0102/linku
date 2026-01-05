import jwt from "jsonwebtoken"
import { JWT_SECRET } from "~/config/env.js"
import { Result } from "~/lib/Result.js"
import type { UserRepository } from "~/repositories/user-repository.js"
import type { AuthService } from "~/services/auth-services/auth-service.js"

export class Authenticate {
  constructor(
    private repo: UserRepository,
    private authService: AuthService
  ) {}

  async execute(idToken: string): Promise<Result<string>> {
    const payload = await this.authService.verifyToken(idToken)

    if (!payload.success) {
      return Result.fail(new Error("Token is not valid"))
    }

    const user = await (async () => {
      const existingUser = await this.repo.findByEmail(payload.data.email)

      if (existingUser) {
        return existingUser
      }

      return this.repo.create(payload.data)
    })()

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })
    return Result.ok(token)
  }
}
