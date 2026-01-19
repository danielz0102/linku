import { LoginWithCredentials } from "#application/use-cases/login-with-credentials.js"
import { RegisterWithCredentials } from "#application/use-cases/register-with-credentials.js"
import * as deps from "#infraestructure/dependencies.js"
import { AuthController } from "#presentation/controllers/auth-controller.js"
import { createAuthRouter } from "#presentation/routers/auth-router.js"

export function composeAuthRouter() {
  const loginUseCase = new LoginWithCredentials({
    repo: deps.userRepository,
    hasher: deps.passwordHasher,
    tokenService: deps.tokenService,
  })
  const registerUseCase = new RegisterWithCredentials({
    repo: deps.userRepository,
    hasher: deps.passwordHasher,
    tokenService: deps.tokenService,
    fileService: deps.fileService,
  })

  const authController = new AuthController({
    loginWithCredentials: loginUseCase,
    registerWithCredentials: registerUseCase,
  })

  return createAuthRouter(authController)
}
