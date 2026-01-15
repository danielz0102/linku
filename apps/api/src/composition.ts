import { BcryptHasher } from "#adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#adapters/drizzle-user-repository.js"
import { JwtService } from "#adapters/jwt-service.js"
import { JWT_SECRET, SALT } from "#config/env.js"
import { AuthController } from "#controllers/auth-controller.js"
import { createAuthRouter } from "#routers/auth-router.js"
import { LoginWithCredentials } from "#use-cases/login-with-credentials.js"

export function composeAuthRouter() {
  const useCase = new LoginWithCredentials({
    repo: new DrizzleUserRepository(),
    hasher: new BcryptHasher(SALT),
    tokenService: new JwtService(JWT_SECRET),
  })
  const authController = new AuthController({
    loginWithCredentials: useCase,
  })

  return createAuthRouter(authController)
}
