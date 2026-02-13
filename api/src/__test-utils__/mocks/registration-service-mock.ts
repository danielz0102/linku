import { RegistrationService } from "#modules/users/features/register/registration-service.js"
import type { UserRepository } from "#modules/users/interfaces/user-repository.d.js"

export class RegistrationServiceMock extends RegistrationService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hashPassword: vi.fn(),
    })
  }

  override register = vi.fn<RegistrationService["register"]>()
}
