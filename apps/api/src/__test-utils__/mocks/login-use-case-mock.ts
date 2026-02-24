import { LoginUseCase } from "~/users/application/use-cases/login-use-case.ts"
import type { PasswordHasher } from "~/users/application/ports/password-hasher.ts"
import type { UserRepository } from "~/users/application/ports/user-repository.js"

export class LoginUseCaseMock extends LoginUseCase {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override login = vi.fn<LoginUseCase["login"]>()
}
