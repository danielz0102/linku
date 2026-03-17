import { DrizzleUserReadRepository } from "#api/users/adapters/drizzle-user-read-repository.js"
import { SearchUsers } from "#core/use-cases/search-users-use-case.js"
import { onlyAuth } from "#shared/middlewares/only-auth.js"
import { queryValidator } from "#shared/middlewares/query-validator.js"

import { getUsersSchema } from "./get-users-schema.js"
import { searchUsersHandler } from "./search-users-handler.js"

export const getUsersEndpoint = [
  onlyAuth,
  queryValidator(getUsersSchema),
  searchUsersHandler(new SearchUsers(new DrizzleUserReadRepository())),
]
