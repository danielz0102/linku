import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { validator } from "#shared/middlewares/validator.js"
import { UpdateUserUseCase } from "#users/application/use-cases/update-user-use-case.js"
import { DrizzleUserRepository } from "#users/infrastructure/adapters/drizzle-user-repository.js"
import { updateUserHandler } from "#users/infrastructure/handlers/update-user-handler.js"
import { updateUserSchema } from "#users/infrastructure/schemas/update-user-schema.js"

const service = new UpdateUserUseCase({
  userRepo: new DrizzleUserRepository(),
})

export const updateUserEndpoint = [
  onlyAuth,
  validator(updateUserSchema),
  updateUserHandler(service),
]
