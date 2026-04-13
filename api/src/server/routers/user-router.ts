import { Router } from "express"

import { signUpHandler } from "#modules/users/commands/sign-up/sign-up-http-handler.ts"
import { whoamiHandler } from "#modules/users/queries/whoami/whoami-http-handler.ts"

export const userRouter = Router()

userRouter.get("/", whoamiHandler)
userRouter.post("/", signUpHandler)
