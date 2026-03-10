import { queryValidator } from "#shared/middlewares/query-validator.js"
import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { userRepository } from "#users/infrastructure/dependencies.js"
import { getUsersHandler } from "#users/infrastructure/handlers/get-users-handler.js"
import { getUsersSchema } from "#users/infrastructure/schemas/get-users-schema.js"

export const getUsersEndpoint = [
  onlyAuth,
  queryValidator(getUsersSchema),
  getUsersHandler(userRepository),
]
