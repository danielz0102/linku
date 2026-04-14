import { Router } from "express"

import { createUserHandler } from "#modules/users/commands/create-user/create-user-http-handler.ts"
import { whoamiHandler } from "#modules/users/queries/whoami/whoami-http-handler.ts"

export const userRouter = Router()

userRouter.post("/", createUserHandler)
userRouter.get("/me", whoamiHandler)
