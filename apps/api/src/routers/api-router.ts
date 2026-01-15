import { Router } from "express"

export function createApiRouter({ authRouter }: { authRouter: Router }) {
  const router = Router()

  router.use("/auth", authRouter)

  return router
}
