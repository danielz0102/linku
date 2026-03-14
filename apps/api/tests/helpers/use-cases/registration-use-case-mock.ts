import type { PasswordHasher } from "~/core/use-cases/ports/password-hasher.ts"
import type { UserRepository } from "~/core/users/user-repository.js"

import { RegistrationUseCase } from "~/core/use-cases/registration-use-case.ts"

export class RegistrationUseCaseMock extends RegistrationUseCase {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override execute = vi.fn<RegistrationUseCase["execute"]>()
}
