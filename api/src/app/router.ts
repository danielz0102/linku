import { usersRouter } from "#modules/users/index.js"
import { Router } from "express"

export const router = Router()

router.use("/users", usersRouter)
