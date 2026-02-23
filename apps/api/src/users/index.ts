import { Router } from "express"
import { loginMiddleware } from "./features/login/index.js"
import { logoutHandler } from "./features/logout/logout-handler.js"
import { meMiddleware } from "./features/me/index.js"
import { registrationMiddleware } from "./features/register/index.js"
import { updateUserMiddleware } from "./features/update-user/index.js"

const router = Router()

router.post("/login", loginMiddleware)
router.post("/logout", logoutHandler)
router.get("/me", meMiddleware)
router.post("/", registrationMiddleware)
router.patch("/", updateUserMiddleware)

export { router as usersRouter }
