import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { DrizzleUserRepository } from "#users/infrastructure/adapters/drizzle-user-repository.js"
import { getUserByIdHandler } from "#users/infrastructure/handlers/get-user-by-id-handler.js"

export const getUserByIdEndpoint = [
  onlyAuth,
  getUserByIdHandler(new DrizzleUserRepository()),
]
