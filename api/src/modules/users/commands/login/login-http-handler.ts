import type { RequestHandler } from "express"
import { z } from "zod"

import { login } from "./login-service.ts"

const loginRequestSchema = z.object({
  username: z.string().trim().nonempty(),
  password: z.string().trim().nonempty(),
})

export const loginHandler: RequestHandler = async (req, res) => {
  const result = loginRequestSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body", details: result.error.issues })
  }

  const user = await login(result.data)

  if (!user) {
    return res.sendStatus(401)
  }

  req.session.userId = user.id
  res.status(201).json(user)
}
