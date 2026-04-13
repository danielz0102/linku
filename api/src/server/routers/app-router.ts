import { Router } from "express"

import { sessionRouter } from "./session-router.ts"
import { userRouter } from "./user-router.ts"

export const appRouter = Router()

appRouter.use("/session", sessionRouter)
appRouter.use("/user", userRouter)
