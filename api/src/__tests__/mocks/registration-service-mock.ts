import type { UserRepository } from "#users/interfaces/user-repository.d.js"
import { RegistrationService } from "#users/register/registration-service.js"

export class RegistrationServiceMock extends RegistrationService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hashPassword: vi.fn(),
    })
  }

  override register = vi.fn<RegistrationService["register"]>()
}
