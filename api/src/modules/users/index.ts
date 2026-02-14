import { Router } from "express"
import { loginMiddleware } from "./features/login/index.js"
import { registrationMiddleware } from "./features/register/index.js"

const router = Router()

router.post("/login", loginMiddleware)
router.post("/", registrationMiddleware)

export { router as usersRouter }
