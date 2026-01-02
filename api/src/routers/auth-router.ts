import { Router } from "express"
import { AuthController } from "~/controllers/auth-controller.js"
import { verifyToken } from "~/middlewares/verify-token.js"

const router = Router()
const controller = new AuthController()

router.post("/google", verifyToken, controller.auth)

export default router
