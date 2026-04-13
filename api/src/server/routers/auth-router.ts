import { Router } from "express"

export const authRouter = Router()

import "#modules/users/commands/login/login-http-controller.ts"
import "#modules/users/commands/logout.ts/logout-http-controller.ts"
import "#modules/users/commands/sign-up/sign-up-http-controller.ts"
import "#modules/users/queries/whoami/whoami-http-controller.ts"
