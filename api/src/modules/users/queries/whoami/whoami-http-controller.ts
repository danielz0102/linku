import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { authRouter } from "#server/routers/auth-router.ts"

authRouter.get("/whoami", async (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    res.status(401).json({ message: "User is not authenticated" })
    return
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .then((result) => result[0])

  if (!user) {
    res.status(401).json({ message: "User is not authenticated" })
    return
  }

  res.status(200).json({
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePictureUrl: user.profilePictureUrl,
    bio: user.bio,
  })
})
