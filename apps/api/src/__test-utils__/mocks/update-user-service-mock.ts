import { UpdateUserService } from "#users/features/update-user/update-user-service.js"
import type { UserRepository } from "#users/interfaces/user-repository.d.js"

export class UpdateUserServiceMock extends UpdateUserService {
  constructor() {
    super({
      userRepo: {} as UserRepository,
    })
  }

  override update = vi.fn<UpdateUserService["update"]>()
}
