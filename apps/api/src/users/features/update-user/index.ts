import { onlyAuth } from "#shared/middlewares/only-auth.js"
import { DrizzleUserRepository } from "#users/implementations/drizzle-user-repository.js"
import { updateUserHandler } from "./update-user-handler.js"
import { UpdateUserService } from "./update-user-service.js"
import { validateUpdateUser } from "./validate-update-user.js"

const service = new UpdateUserService({
  userRepo: new DrizzleUserRepository(),
})

export const updateUserMiddleware = [
  onlyAuth,
  validateUpdateUser,
  updateUserHandler(service),
]
