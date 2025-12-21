import { Router } from "express"
import authRouter from "~/presentation/auth/auth-router.js"

const apiRouter = Router()

apiRouter.use("/auth", authRouter)

export default apiRouter
