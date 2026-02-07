import type { UserRepository } from "#users/interfaces/user-repository.d.js"
import { RegisterService } from "#users/register/register-service.js"

export class RegisterServiceMock extends RegisterService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
      hashPassword: vi.fn(),
    })
  }

  override register = vi.fn<RegisterService["register"]>()
}
