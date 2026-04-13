import { z } from "zod"

import { authRouter } from "#server/routers/auth-router.ts"
import { validateZodBodyMiddleware } from "#shared/validate-zod-body-middleware.ts"

import { login } from "./login-service.ts"

const loginBodySchema = z.object({
  username: z.string().trim().nonempty(),
  password: z.string().trim().nonempty(),
})

authRouter.post(
  "/login",
  validateZodBodyMiddleware(loginBodySchema),
  async (req, res) => {
    const userId = await login(req.body)

    if (!userId) {
      res.status(401).json({ message: "Invalid credentials" })
      return
    }

    req.session.userId = userId
    res.sendStatus(204)
  }
)
