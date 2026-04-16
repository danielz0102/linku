import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"

type UpdateUserCommand = {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePictureUrl: string
  bio: string
}

export async function updateUser(cmd: UpdateUserCommand): Promise<boolean> {
  const isUnique = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, cmd.username))
    .then((r) => r.length === 0)

  if (!isUnique) return false

  await db
    .update(users)
    .set({
      username: cmd.username,
      firstName: cmd.firstName,
      lastName: cmd.lastName,
      profilePictureUrl: cmd.profilePictureUrl,
      bio: cmd.bio,
    })
    .where(eq(users.id, cmd.id))

  return true
}
