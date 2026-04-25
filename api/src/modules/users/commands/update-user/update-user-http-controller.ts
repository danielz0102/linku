import type { RequestHandler } from "express"
import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"

import { UpdateUserService } from "./update-user-service.ts"

const updateUser = new UpdateUserService(db)
const updateUserRequestSchema = z.object({
  username: z.string().trim().nonempty(),
  firstName: z.string().trim().nonempty(),
  lastName: z.string().trim().nonempty(),
  profilePictureUrl: z.url({ protocol: /^https$/, hostname: z.regexes.domain }).nullable(),
  bio: z.string().trim().nullable(),
})

export const updateUserController: RequestHandler = async (req, res) => {
  const id = req.session.userId

  if (!id) {
    return res.sendStatus(401)
  }

  const result = updateUserRequestSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body", details: result.error.issues })
  }

  const user = await updateUser.execute({ id, ...result.data })

  if (!user) {
    return res.status(409).json({ message: "Username is already taken" })
  }

  return res.json(user)
}
