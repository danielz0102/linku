import { Router } from "express"
import { AuthController } from "~/controllers/auth-controller.js"
import { verifyToken } from "~/middlewares/verify-token.js"
import { UserRepository } from "~/repositories/user-repository.js"
import { GoogleAuthService } from "~/services/auth-services/google-auth-service.js"

const router = Router()
const controller = new AuthController(
  new UserRepository(),
  new GoogleAuthService()
)

router.post("/google", verifyToken, controller.auth)

export default router
