import { onlyAuth } from "#shared/middlewares/only-auth.js"
import { DrizzleUserRepository } from "#users/implementations/drizzle-user-repository.js"
import { meHandler } from "./me-handler.js"

export const meMiddleware = [onlyAuth, meHandler(new DrizzleUserRepository())]
