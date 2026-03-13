import type { PasswordHasher } from "~/users/application/ports/password-hasher.ts"
import type { UserRepository } from "~/users/domain/user-repository.js"

import { RegistrationUseCase } from "~/users/application/use-cases/registration-use-case.ts"

export class RegistrationUseCaseMock extends RegistrationUseCase {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override execute = vi.fn<RegistrationUseCase["execute"]>()
}
