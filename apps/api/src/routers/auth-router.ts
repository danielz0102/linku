import type { AuthController } from "#controllers/auth-controller.js"
import { Router } from "express"
import { uploadPicture } from "#middlewares/upload-picture.js"

export function createAuthRouter(controller: AuthController) {
  const router = Router()

  router.post("/login", controller.login)
  router.post("/register", uploadPicture, controller.register)

  return router
}
