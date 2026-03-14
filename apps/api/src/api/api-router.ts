import { Router } from "express"

import { usersRouter } from "./users/users-router.js"

export const apiRouter = Router()

apiRouter.get("/health", (_, res) => {
  res.status(200).send("ok")
})

apiRouter.use("/users", usersRouter)
