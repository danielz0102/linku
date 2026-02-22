import { DrizzleUserRepository } from "#modules/users/implementations/drizzle-user-repository.js"
import { meHandler } from "./me-handler.js"

export const meMiddleware = [meHandler(new DrizzleUserRepository())]
