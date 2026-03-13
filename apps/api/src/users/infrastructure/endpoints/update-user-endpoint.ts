import { validator } from "#shared/middlewares/validator.js"
import { updateUserUseCase } from "#users/infrastructure/dependencies.js"
import { updateUserHandler } from "#users/infrastructure/handlers/update-user-handler.js"
import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { updateUserSchema } from "#users/infrastructure/schemas/update-user-schema.js"

export const updateUserEndpoint = [
  onlyAuth,
  validator(updateUserSchema),
  updateUserHandler(updateUserUseCase),
]
