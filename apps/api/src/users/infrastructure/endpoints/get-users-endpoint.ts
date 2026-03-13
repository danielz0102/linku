import { queryValidator } from "#shared/middlewares/query-validator.js"
import { SearchUsersUseCase } from "#users/application/use-cases/search-users.js"
import { searchUsersHandler } from "#users/infrastructure/handlers/search-users-handler.js"
import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { getUsersSchema } from "#users/infrastructure/schemas/get-users-schema.js"

import { DrizzleUserReadRepository } from "../adapters/drizzle-user-read-repository.js"

export const getUsersEndpoint = [
  onlyAuth,
  queryValidator(getUsersSchema),
  searchUsersHandler(new SearchUsersUseCase(new DrizzleUserReadRepository())),
]
