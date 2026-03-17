import { DrizzleUserRepository } from "#api/shared/drizzle/drizzle-user-repository.js"
import { onlyAuth } from "#api/shared/middlewares/only-auth.js"
import { GetUserByIdUseCase } from "#core/use-cases/get-user-by-id-use-case.js"

import { getUserByIdHandler } from "./get-user-by-id-handler.js"

export const getUserByIdEndpoint = [
  onlyAuth,
  getUserByIdHandler(new GetUserByIdUseCase(new DrizzleUserRepository())),
]
