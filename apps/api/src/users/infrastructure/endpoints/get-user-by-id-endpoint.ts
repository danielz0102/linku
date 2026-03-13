import { userRepository } from "#users/infrastructure/dependencies.js"
import { getUserByIdHandler } from "#users/infrastructure/handlers/get-user-by-id-handler.js"
import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"

export const getUserByIdEndpoint = [onlyAuth, getUserByIdHandler(userRepository)]
