import type { UserRepository } from "~/core/users/user-repository.js"

export class UserRepositoryMock implements UserRepository {
  findOne = vi.fn<UserRepository["findOne"]>()
  findExisting = vi.fn<UserRepository["findExisting"]>()
  save = vi.fn<UserRepository["save"]>()
}
