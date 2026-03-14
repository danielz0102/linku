import { DrizzleUserRepository } from "#api/shared/drizzle/drizzle-user-repository.js"
import { onlyAuth } from "#api/shared/middlewares/only-auth.js"

import { getMeHandler } from "./get-me-handler.js"

export const getMeEndpoint = [onlyAuth, getMeHandler(new DrizzleUserRepository())]
