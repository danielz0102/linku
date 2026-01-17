import { BcryptHasher } from "#adapters/bcrypt-hasher.js"
import { CloudinaryAdapter } from "#adapters/cloudinary-adapter.js"
import { DrizzleUserRepository } from "#adapters/drizzle-user-repository.js"
import { JwtService } from "#adapters/jwt-service.js"
import { JWT_SECRET, SALT } from "#config/env.js"
import { AuthController } from "#controllers/auth-controller.js"
import { createAuthRouter } from "#routers/auth-router.js"
import { LoginWithCredentials } from "#use-cases/login-with-credentials.js"
import { RegisterWithCredentials } from "#use-cases/register-with-credentials.js"

export function composeAuthRouter() {
  const repo = new DrizzleUserRepository()
  const hasher = new BcryptHasher(SALT)
  const tokenService = new JwtService(JWT_SECRET)
  const fileService = new CloudinaryAdapter()

  const loginUseCase = new LoginWithCredentials({
    repo,
    hasher,
    tokenService,
  })
  const registerUseCase = new RegisterWithCredentials({
    repo,
    hasher,
    tokenService,
    fileService,
  })

  const authController = new AuthController({
    loginWithCredentials: loginUseCase,
    registerWithCredentials: registerUseCase,
  })

  return createAuthRouter(authController)
}
