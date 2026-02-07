import { Router } from "express"
import { registrationMiddleware } from "./features/register/index.js"

const router = Router()

router.post("/", registrationMiddleware)

export { router as usersRouter }
