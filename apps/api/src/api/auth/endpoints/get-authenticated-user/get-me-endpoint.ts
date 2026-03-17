import { DrizzleUserRepository } from "#api/shared/drizzle/drizzle-user-repository.js"
import { onlyAuth } from "#api/shared/middlewares/only-auth.js"
import { GetAuthenticatedUser } from "#core/use-cases/get-authenticated-user-use-case.js"

import { getMeHandler } from "./get-me-handler.js"

export const getMeEndpoint = [
  onlyAuth,
  getMeHandler(new GetAuthenticatedUser(new DrizzleUserRepository())),
]
