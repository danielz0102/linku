import { eq } from "drizzle-orm"
import type { RequestHandler } from "express"
import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"
import { usersView } from "#db/drizzle/views.ts"

export const usernameSchema = z.string().trim().nonempty()

export const searchUserByUsernameController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const { success, data: username, error } = usernameSchema.safeParse(req.params["username"])

  if (!success) {
    return res.sendValidationError(error.issues)
  }

  const foundUser = await db
    .select()
    .from(usersView)
    .where(eq(usersView.username, username))
    .limit(1)
    .then((r) => r[0])

  if (!foundUser) {
    return res.sendStatus(404)
  }

  return res.json(foundUser)
}
