import { DrizzleUserRepository } from "#api/shared/drizzle/drizzle-user-repository.js"
import { onlyAuth } from "#api/shared/middlewares/only-auth.js"
import { GetAuthenticatedUserUseCase } from "#core/use-cases/get-authenticated-user-use-case.js"

import { getMeHandler } from "./get-me-handler.js"

export const getMeEndpoint = [
  onlyAuth,
  getMeHandler(new GetAuthenticatedUserUseCase(new DrizzleUserRepository())),
]
