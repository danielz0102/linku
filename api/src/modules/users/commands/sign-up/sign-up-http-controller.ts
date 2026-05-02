import type { RequestHandler } from "express"
import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"

import { SignUpCommandHandler } from "./sign-up-command-handler.ts"

const signUp = new SignUpCommandHandler(db)
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

export const signUpController: RequestHandler = async (req, res) => {
  const result = signUpRequestSchema.safeParse(req.body)

  if (!result.success) {
    return res.sendValidationError(result.error.issues)
  }

  const user = await signUp.execute(result.data)

  if (!user) {
    return res.status(409).json({ message: "User is already registered" })
  }

  req.session.userId = user.id
  res.status(201).json(user)
}
