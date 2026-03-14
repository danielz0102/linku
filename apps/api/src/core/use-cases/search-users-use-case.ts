import type { UserReadRepository } from "./ports/user-read-repository.js"

export class SearchUsersUseCase {
  constructor(private users: UserReadRepository) {}

  async execute(query: string, limit?: number, offset?: number) {
    return this.users.search(
      { firstName: query, lastName: query, username: query },
      { limit, offset }
    )
  }
}
