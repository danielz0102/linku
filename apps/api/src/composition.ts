import { BcryptHasher } from "#adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#adapters/drizzle-user-repository.js"
import { JwtService } from "#adapters/jwt-service.js"
import { JWT_SECRET, SALT } from "#config/env.js"
import { AuthController } from "#controllers/auth-controller.js"
import { AuthModel } from "#models/auth-model.js"
import { createAuthRouter } from "#routers/auth-router.js"

export function composeAuthRouter() {
  const authModel = new AuthModel({
    repo: new DrizzleUserRepository(),
    hasher: new BcryptHasher(SALT),
    tokenService: new JwtService(JWT_SECRET),
  })
  const authController = new AuthController(authModel)
  return createAuthRouter(authController)
}
