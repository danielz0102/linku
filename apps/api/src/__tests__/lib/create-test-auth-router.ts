import type { FileService } from "#application/ports/file-service.d.js"
import type { PasswordHasher } from "#application/ports/password-hasher.js"
import type { TokenService } from "#application/ports/token-service.js"
import type { UserRepository } from "#application/ports/user-repository.d.js"

import { LoginWithCredentials } from "#application/use-cases/login-with-credentials.js"
import { RegisterWithCredentials } from "#application/use-cases/register-with-credentials.js"
import * as deps from "#infrastructure/dependencies.js"
import { AuthController } from "#presentation/controllers/auth-controller.js"
import { createAuthRouter } from "#presentation/routers/auth-router.js"

type Dependencies = {
  repo?: UserRepository
  hasher?: PasswordHasher
  tokenService?: TokenService
  fileService?: FileService
}

export function createTestAuthRouter({
  repo = deps.userRepo,
  hasher = deps.hasher,
  tokenService = deps.tokenSvc,
  fileService = deps.fileSvc,
}: Dependencies = {}) {
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
