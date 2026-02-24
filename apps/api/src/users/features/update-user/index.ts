import { onlyAuth } from "#shared/middlewares/only-auth.js"
import { validator } from "#shared/middlewares/validator.js"
import { DrizzleUserRepository } from "#users/implementations/drizzle-user-repository.js"
import { updateUserHandler } from "./update-user-handler.js"
import { UpdateUserService } from "./update-user-service.js"
import { updateUserSchema } from "./update-user-schema.js"

const service = new UpdateUserService({
  userRepo: new DrizzleUserRepository(),
})

export const updateUserMiddleware = [
  onlyAuth,
  validator(updateUserSchema),
  updateUserHandler(service),
]
