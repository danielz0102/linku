import type { UserRepository } from "~/core/users/user-repository.js"

export class UserRepositoryMock implements UserRepository {
  findExisting = vi.fn<UserRepository["findExisting"]>()
  checkUniqueness = vi.fn<UserRepository["checkUniqueness"]>()
  save = vi.fn<UserRepository["save"]>()
}
