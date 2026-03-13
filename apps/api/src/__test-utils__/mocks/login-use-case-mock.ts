import type { PasswordHasher } from "~/users/application/ports/password-hasher.ts"
import type { UserRepository } from "~/users/domain/user-repository.js"

import { LoginUseCase } from "~/users/application/use-cases/login-use-case.ts"

export class LoginUseCaseMock extends LoginUseCase {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override execute = vi.fn<LoginUseCase["execute"]>()
}
