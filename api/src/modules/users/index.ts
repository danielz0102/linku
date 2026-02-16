import { Router } from "express"
import { loginMiddleware } from "./features/login/index.js"
import { logoutHandler } from "./features/logout/logout-handler.js"
import { meMiddleware } from "./features/me/index.js"
import { registrationMiddleware } from "./features/register/index.js"

const router = Router()

router.post("/login", loginMiddleware)
router.post("/logout", logoutHandler)
router.get("/me", meMiddleware)
router.post("/", registrationMiddleware)

export { router as usersRouter }
