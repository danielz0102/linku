import { eq } from "drizzle-orm"
import type { RequestHandler } from "express"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"

export const whoamiController: RequestHandler = async (req, res) => {
  const id = req.session.userId

  if (!id) {
    return res.sendStatus(401)
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
    .then((res) => res[0]!)

  res.json({
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePictureUrl: user.profilePictureUrl,
    bio: user.bio,
  })
}
