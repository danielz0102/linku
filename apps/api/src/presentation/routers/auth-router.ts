import type { AuthController } from "#presentation/controllers/auth-controller.js"
import { Router } from "express"
import { uploadPicture } from "#presentation/middlewares/upload-picture.js"
import { validate } from "#presentation/middlewares/validate.js"
import { loginSchema } from "#presentation/schemas/login-schema.js"
import { registerSchema } from "#presentation/schemas/register-schema.js"

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
