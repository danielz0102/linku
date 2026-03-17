import { UpdateUser } from "#core/use-cases/update-user-use-case.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { onlyAuth } from "#shared/middlewares/only-auth.js"
import { validator } from "#shared/middlewares/validator.js"

import { updateUserHandler } from "./update-user-handler.js"
import { updateUserSchema } from "./update-user-schema.js"

export const updateUserEndpoint = [
  onlyAuth,
  validator(updateUserSchema),
  updateUserHandler(new UpdateUser(new DrizzleUserRepository())),
]
