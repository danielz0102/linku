import { RegistrationUseCase } from "~/users/application/use-cases/registration-use-case.ts"
import type { PasswordHasher } from "~/users/application/ports/password-hasher.ts"
import type { UserRepository } from "~/users/application/ports/user-repository.js"

export class RegistrationUseCaseMock extends RegistrationUseCase {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override register = vi.fn<RegistrationUseCase["register"]>()
}
