import { DrizzleUserReadRepository } from "#api/users/adapters/drizzle-user-read-repository.js"
import { SearchUsers } from "#core/use-cases/search-users-use-case.js"
import { onlyAuth } from "#shared/middlewares/only-auth.js"
import { queryValidator } from "#shared/middlewares/query-validator.js"

import { getUsersSchema } from "./get-users-schema.js"
import { searchUsersHandler } from "./search-users-handler.js"

export class SearchUsersEndpoint {
  constructor(private readonly search: SearchUsers) {}

  static buildDefault() {
    return new SearchUsersEndpoint(new SearchUsers(new DrizzleUserReadRepository())).build()
  }

  build() {
    return [onlyAuth, queryValidator(getUsersSchema), searchUsersHandler(this.search)]
  }
}
