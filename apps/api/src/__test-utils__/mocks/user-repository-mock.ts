import type { UserRepository } from "~/users/domain/user-repository.js"

export class UserRepositoryMock implements UserRepository {
  create = vi.fn<UserRepository["create"]>()
  findOne = vi.fn<UserRepository["findOne"]>()
  search = vi.fn<UserRepository["search"]>()
  update = vi.fn<UserRepository["update"]>()
  save = vi.fn<UserRepository["save"]>()
}
