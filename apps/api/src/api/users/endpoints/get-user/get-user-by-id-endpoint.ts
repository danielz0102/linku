import { GetUserByIdUseCase } from "#core/use-cases/get-user-by-id-use-case.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { onlyAuth } from "#shared/middlewares/only-auth.js"

import { getUserByIdHandler } from "./get-user-by-id-handler.js"

export const getUserByIdEndpoint = [
  onlyAuth,
  getUserByIdHandler(new GetUserByIdUseCase(new DrizzleUserRepository())),
]
