import { RegistrationService } from "#users/features/register/registration-service.js"
import type { PasswordHasher } from "#users/interfaces/password-hasher.js"
import type { UserRepository } from "#users/interfaces/user-repository.d.js"

export class RegistrationServiceMock extends RegistrationService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override register = vi.fn<RegistrationService["register"]>()
}
