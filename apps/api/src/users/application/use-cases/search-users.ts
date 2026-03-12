import type { UserReadRepository } from "../ports/user-read-repository.js"

export class SearchUsersUseCase {
  constructor(private repo: UserReadRepository) {}

  async execute(query: string, limit?: number, offset?: number) {
    return this.repo.search(
      { firstName: query, lastName: query, username: query },
      { limit, offset }
    )
  }
}
