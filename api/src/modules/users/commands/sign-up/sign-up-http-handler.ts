import type { RequestHandler } from "express"
import { z } from "zod"

import { signUp } from "./sign-up-service.ts"

const signUpRequestSchema = z.object({
  username: z.string().trim().nonempty(),
  firstName: z.string().trim().nonempty(),
  lastName: z.string().trim().nonempty(),
  password: z
    .string()
    .trim()
    .min(8)
    .regex(/^(?=.*[^a-zA-Z0-9])/, "Password must contain at least one special character"),
})

export const signUpHandler: RequestHandler = async (req, res) => {
  const result = signUpRequestSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body", details: result.error.issues })
  }

  const id = await signUp(result.data)

  if (!id) {
    return res.status(409).json({ message: "User is already registered" })
  }

  req.session.userId = id
  res.sendStatus(201)
}
