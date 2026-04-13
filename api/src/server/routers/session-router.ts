import { Router } from "express"

import { loginHandler } from "#modules/users/commands/login/login-http-handler.ts"
import { logoutHandler } from "#modules/users/commands/logout.ts/logout-http-handler.ts"

export const sessionRouter = Router()

sessionRouter.post("/", loginHandler)
sessionRouter.delete("/", logoutHandler)
