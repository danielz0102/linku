import { Router } from "express"
import rateLimit from "express-rate-limit"
import { loginMiddleware } from "./features/login/index.js"
import { registrationMiddleware } from "./features/register/index.js"

const router = Router()
const loginRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

router.get("/", loginRateLimit, loginMiddleware)
router.post("/", registrationMiddleware)

export { router as usersRouter }
