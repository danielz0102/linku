import { RegistrationService } from "~/users/features/register/registration-service.ts"
import type { PasswordHasher } from "~/users/interfaces/password-hasher.ts"
import type { UserRepository } from "~/users/interfaces/user-repository.d.ts"

export class RegistrationServiceMock extends RegistrationService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hasher: {} as PasswordHasher,
    })
  }

  override register = vi.fn<RegistrationService["register"]>()
}
