import { Router } from "express"

import { RATE_LIMIT_ENABLED } from "#env.ts"
import { loginController } from "#modules/users/commands/login/login-http-controller.ts"
import { loginRateLimitMiddleware } from "#modules/users/commands/login/login-rate-limit-middleware.ts"
import { logoutController } from "#modules/users/commands/logout.ts/logout-http-controller.ts"

export const sessionRouter = Router()

const loginMiddlewares = RATE_LIMIT_ENABLED ? [loginRateLimitMiddleware] : []

sessionRouter.post("/", ...loginMiddlewares, loginController)
sessionRouter.delete("/", logoutController)
