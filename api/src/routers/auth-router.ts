import { Router } from "express"
import { AuthController } from "~/controllers/auth-controller.js"
import { AuthModel } from "~/models/auth-model.js"
import { IdentityRepository } from "~/repositories/identity-repository.js"
import { UserRepository } from "~/repositories/user-repository.js"
import { GoogleAuthProvider } from "~/services/auth-providers/google-auth-provider.js"

const auth = new AuthModel({
  userRepo: new UserRepository(),
  authProvider: new GoogleAuthProvider(),
  identityRepo: new IdentityRepository(),
})
const controller = new AuthController(auth)
const router = Router()

router.get("/me", controller.getMe)
router.post("/google", controller.auth)
router.get("/logout", controller.logout)

export default router
