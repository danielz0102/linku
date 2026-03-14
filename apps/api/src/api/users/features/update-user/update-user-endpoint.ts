import { DrizzleUserRepository } from "#api/shared/drizzle/drizzle-user-repository.js"
import { onlyAuth } from "#api/shared/middlewares/only-auth.js"
import { validator } from "#api/shared/middlewares/validator.js"
import { UpdateUserUseCase } from "#core/use-cases/update-user-use-case.js"

import { updateUserHandler } from "./update-user-handler.js"
import { updateUserSchema } from "./update-user-schema.js"

export const updateUserEndpoint = [
  onlyAuth,
  validator(updateUserSchema),
  updateUserHandler(new UpdateUserUseCase(new DrizzleUserRepository())),
]
