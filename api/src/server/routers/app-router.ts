import { Router } from "express"

import { sessionRouter } from "./auth-router.ts"

export const appRouter = Router()

appRouter.use("/auth", sessionRouter)
