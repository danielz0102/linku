import type { UserRepository } from "~/users/application/ports/user-repository.js"

export class UserRepositoryMock implements UserRepository {
  create = vi.fn<UserRepository["create"]>()
  matching = vi.fn<UserRepository["matching"]>()
  update = vi.fn<UserRepository["update"]>()
}
