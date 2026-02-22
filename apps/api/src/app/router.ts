import { usersRouter } from "#users/index.js"
import { Router } from "express"

export const router = Router()

router.get("/health", (_, res) => {
  res.status(200).send("ok")
})

router.use("/users", usersRouter)
