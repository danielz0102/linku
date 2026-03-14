import { Router } from "express"

import { authRouter } from "./auth/auth-router.js"
import { usersRouter } from "./users/users-router.js"

export const apiRouter = Router()

apiRouter.get("/health", (_, res) => {
  res.status(200).send("ok")
})

apiRouter.use("/auth", authRouter)
apiRouter.use("/users", usersRouter)
