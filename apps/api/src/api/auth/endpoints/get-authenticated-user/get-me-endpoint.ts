import { GetAuthenticatedUser } from "#core/use-cases/get-authenticated-user-use-case.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { onlyAuth } from "#shared/middlewares/only-auth.js"

import { getMeHandler } from "./get-me-handler.js"

export const getMeEndpoint = [
  onlyAuth,
  getMeHandler(new GetAuthenticatedUser(new DrizzleUserRepository())),
]
