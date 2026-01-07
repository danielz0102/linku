import { Router } from "express"
import { AuthController } from "~/controllers/auth-controller.js"
import { verifyToken } from "~/middlewares/verify-token.js"
import { UserRepository } from "~/repositories/user-repository.js"
import { GoogleAuthService } from "~/services/auth-services/google-auth-service.js"
import { AuthModel } from "~/models/auth-model.js"

const router = Router()
const auth = new AuthModel(new UserRepository(), new GoogleAuthService())
const controller = new AuthController(auth)

router.get("/me", controller.getMe)
router.post("/google", verifyToken, controller.auth)

export default router
