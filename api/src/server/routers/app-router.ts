import { Router } from "express"

import { authRouter } from "./auth-router.ts"

export const appRouter = Router()

appRouter.use("/auth", authRouter)
