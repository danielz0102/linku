import { LoginWithCredentials } from "#application/use-cases/login-with-credentials.js"
import { RegisterWithCredentials } from "#application/use-cases/register-with-credentials.js"
import { JWT_SECRET, SALT } from "#infraestructure/config/env.js"
import { AuthController } from "#presentation/controllers/auth-controller.js"
import { BcryptHasher } from "#infraestructure/adapters/bcrypt-hasher.js"
import { CloudinaryAdapter } from "#infraestructure/adapters/cloudinary-adapter.js"
import { DrizzleUserRepository } from "#infraestructure/adapters/drizzle-user-repository.js"
import { JwtService } from "#infraestructure/adapters/jwt-service.js"
import { createAuthRouter } from "#presentation/routers/auth-router.js"

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
