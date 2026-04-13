import { z } from "zod"

import { signUp } from "#modules/users/commands/sign-up/sign-up-service.ts"
import { authRouter } from "#server/routers/auth-router.ts"
import { validateZodBodyMiddleware } from "#shared/validate-zod-body-middleware.ts"

const signUpBodySchema = z.object({
  username: z.string().trim().nonempty(),
  firstName: z.string().trim().nonempty(),
  lastName: z.string().trim().nonempty(),
  password: z
    .string()
    .trim()
    .min(8)
    .regex(/^(?=.*[^a-zA-Z0-9])/, "Password must contain at least one special character"),
})

authRouter.post(
  "/sign-up",
  validateZodBodyMiddleware(signUpBodySchema),
  async (req, res) => {
    const userId = await signUp(req.body)

    if (!userId) {
      res.status(409).json({ message: "Username already exists" })
      return
    }

    req.session.userId = userId
    res.sendStatus(204)
  }
)
