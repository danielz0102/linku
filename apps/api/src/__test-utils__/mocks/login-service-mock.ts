import { LoginService } from "#users/features/login/login-service.js"
import type { PasswordHasher } from "#users/interfaces/password-hasher.js"
import type { UserRepository } from "#users/interfaces/user-repository.d.js"

export class LoginServiceMock extends LoginService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override login = vi.fn<LoginService["login"]>()
}
