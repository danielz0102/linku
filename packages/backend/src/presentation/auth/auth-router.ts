import type { AuthController } from "./auth-controller.js"

import { Router } from "express"
import { validate } from "../middlewares/validate.js"
import { registerUserSchema } from "./schemas/register-user-schema.js"

export function createAuthRouter(controller: AuthController) {
  const router = Router()

  router.post(
    "/register",
    validate(registerUserSchema),
    controller.registerUser
  )

  return router
}
