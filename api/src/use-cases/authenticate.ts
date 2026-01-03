import jwt from "jsonwebtoken"
import { JWT_SECRET } from "~/config/env.js"
import { Result } from "~/lib/Result.js"
import type { UserRepository } from "~/repositories/user-repository.js"
import type { AuthService } from "~/services/auth-services/auth-service.js"

interface Params {
  idToken: string
  repo: UserRepository
  authService: AuthService
}

export async function authenticate({
  idToken,
  repo,
  authService,
}: Params): Promise<Result<string>> {
  const payload = await authService.verifyToken(idToken)

  if (!payload.success) {
    return Result.fail(new Error("Token is not valid"))
  }

  const user = await (async () => {
    const existingUser = await repo.findByEmail(payload.data.email)

    if (existingUser) {
      return existingUser
    }

    return repo.create(payload.data)
  })()

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })
  return Result.ok(token)
}
