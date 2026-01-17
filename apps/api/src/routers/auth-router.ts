import type { AuthController } from "#controllers/auth-controller.js"
import { Router } from "express"
import { uploadPicture } from "#middlewares/upload-picture.js"
import { validate } from "#middlewares/validate.js"
import { loginSchema } from "#schemas/login-schema.js"
import { registerSchema } from "#schemas/register-schema.js"

export function createAuthRouter(controller: AuthController) {
  const router = Router()

  router.post("/login", validate(loginSchema), controller.login)
  router.post(
    "/register",
    uploadPicture,
    validate(registerSchema),
    controller.register
  )

  return router
}
