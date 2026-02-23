import { LoginService } from "~/users/features/login/login-service.ts"
import type { PasswordHasher } from "~/users/interfaces/password-hasher.ts"
import type { UserRepository } from "~/users/interfaces/user-repository.d.ts"

export class LoginServiceMock extends LoginService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override login = vi.fn<LoginService["login"]>()
}
