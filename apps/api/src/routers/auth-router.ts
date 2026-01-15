import type { AuthController } from "#controllers/auth-controller.js"
import { Router } from "express"

export function createAuthRouter(controller: AuthController) {
  const router = Router()

  router.post("/login", controller.login)
  router.post("/register", controller.register)

  return router
}
