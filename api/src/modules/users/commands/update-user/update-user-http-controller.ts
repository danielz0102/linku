import type { RequestHandler } from "express"
import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"

import { UpdateUserCommandHandler } from "./update-user-command-handler.ts"

const updateUser = new UpdateUserCommandHandler(db)
const updateUserRequestSchema = z.object({
  username: z.string().trim().nonempty(),
  firstName: z.string().trim().nonempty(),
  lastName: z.string().trim().nonempty(),
  bio: z.string().trim().nullable(),
})

export const updateUserController: RequestHandler = async (req, res) => {
  const id = req.session.userId

  if (!id) {
    return res.sendStatus(401)
  }

  const result = updateUserRequestSchema.safeParse(req.body)

  if (!result.success) {
    return res.sendValidationError(result.error.issues)
  }

  const user = await updateUser.execute({ id, ...result.data })

  if (!user) {
    return res.status(409).json({ message: "Username is already taken" })
  }

  return res.json(user)
}
