import type { PasswordHasher } from "~/core/use-cases/ports/password-hasher.ts"
import type { UserRepository } from "~/core/users/user-repository.js"

import { LoginUseCase } from "~/core/use-cases/login-use-case.ts"

export class LoginUseCaseMock extends LoginUseCase {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override execute = vi.fn<LoginUseCase["execute"]>()
}
