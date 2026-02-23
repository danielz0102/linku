import type { UserRepository } from "~/users/interfaces/user-repository.d.ts"

export class UserRepositoryMock implements UserRepository {
  create = vi.fn<UserRepository["create"]>()
  search = vi.fn<UserRepository["search"]>()
  update = vi.fn<UserRepository["update"]>()
}
