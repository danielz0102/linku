import { LoginService } from "#modules/users/features/login/login-service.js"
import type { PasswordHasher } from "#modules/users/interfaces/password-hasher.js"
import type { UserRepository } from "#modules/users/interfaces/user-repository.d.js"

export class LoginServiceMock extends LoginService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override login = vi.fn<LoginService["login"]>()
}
