import { LoginWithCredentials } from "#application/use-cases/login-with-credentials.js"
import { RegisterWithCredentials } from "#application/use-cases/register-with-credentials.js"
import * as deps from "#infraestructure/dependencies.js"
import { AuthController } from "#presentation/controllers/auth-controller.js"
import { createAuthRouter } from "#presentation/routers/auth-router.js"

export function composeAuthRouter() {
  const loginUseCase = new LoginWithCredentials({
    repo: deps.userRepo,
    hasher: deps.hasher,
    tokenService: deps.tokenSvc,
  })
  const registerUseCase = new RegisterWithCredentials({
    repo: deps.userRepo,
    hasher: deps.hasher,
    tokenService: deps.tokenSvc,
    fileService: deps.fileSvc,
  })

  const authController = new AuthController({
    loginWithCredentials: loginUseCase,
    registerWithCredentials: registerUseCase,
  })

  return createAuthRouter(authController)
}
