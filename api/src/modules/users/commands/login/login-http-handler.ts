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

  const id = await login(result.data)

  if (!id) {
    return res.sendStatus(401)
  }

  req.session.userId = id
  res.sendStatus(200)
}
