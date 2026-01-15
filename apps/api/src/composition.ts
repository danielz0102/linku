import { AuthController } from "#controllers/auth-controller.js"
import { AuthModel } from "#models/auth-model.js"
import { createAuthRouter } from "#routers/auth-router.js"

export function composeAuthRouter() {
  const authModel = new AuthModel()
  const authController = new AuthController(authModel)
  return createAuthRouter(authController)
}
