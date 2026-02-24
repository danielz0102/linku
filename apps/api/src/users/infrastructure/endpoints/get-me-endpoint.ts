import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { DrizzleUserRepository } from "#users/infrastructure/adapters/drizzle-user-repository.js"
import { getMeHandler } from "#users/infrastructure/handlers/get-me-handler.js"

export const getMeEndpoint = [
  onlyAuth,
  getMeHandler(new DrizzleUserRepository()),
]
