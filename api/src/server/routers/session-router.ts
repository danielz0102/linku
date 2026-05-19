import { Router } from "express"

import { loginController } from "#modules/users/commands/login/login-http-controller.ts"
import { logoutController } from "#modules/users/commands/logout.ts/logout-http-controller.ts"
import { loginRateLimitMiddleware } from "#server/middlewares/login-rate-limit-middleware.ts"

export const sessionRouter = Router()

sessionRouter.post("/", loginRateLimitMiddleware, loginController)
sessionRouter.delete("/", logoutController)
