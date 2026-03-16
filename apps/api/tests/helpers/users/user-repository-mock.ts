import type { UserRepository } from "~/core/users/user-repository.js"

export class UserRepositoryMock implements UserRepository {
  findOne = vi.fn<UserRepository["findOne"]>()
  findConflict = vi.fn<UserRepository["findConflict"]>()
  save = vi.fn<UserRepository["save"]>()
}
