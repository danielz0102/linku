import type { UserRepository } from "#modules/users/interfaces/user-repository.d.js"

export class UserRepositoryMock implements UserRepository {
  create = vi.fn<UserRepository["create"]>()
  search = vi.fn<UserRepository["search"]>()
}
