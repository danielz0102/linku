import { and, eq, not } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { toDomain } from "#modules/users/database/user-model.ts"
import type { User } from "#modules/users/domain/user.ts"

type UpdateUserCommand = {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePictureUrl: string | null
  bio: string | null
}

export async function updateUser(cmd: UpdateUserCommand): Promise<User | undefined> {
  const isUnique = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.username, cmd.username), not(eq(users.id, cmd.id))))
    .then((r) => r.length === 0)

  if (!isUnique) return

  const record = await db
    .update(users)
    .set({
      username: cmd.username,
      firstName: cmd.firstName,
      lastName: cmd.lastName,
      profilePictureUrl: cmd.profilePictureUrl,
      bio: cmd.bio,
    })
    .where(eq(users.id, cmd.id))
    .returning()
    .then((r) => r[0]!)

  return toDomain(record)
}
