import { Router } from "express"

import { loginController } from "#modules/users/commands/login/login-http-controller.ts"
import { logoutController } from "#modules/users/commands/logout.ts/logout-http-controller.ts"

export const sessionRouter = Router()

sessionRouter.post("/", loginController)
sessionRouter.delete("/", logoutController)
