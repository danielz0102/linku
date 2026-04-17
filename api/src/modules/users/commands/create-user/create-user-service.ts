import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { SALT } from "#env.ts"
import { toDomain } from "#modules/users/database/user-model.ts"
import type { User } from "#modules/users/domain/user.ts"

type CreateUserCommand = {
  username: string
  password: string
  firstName: string
  lastName: string
}

export async function createUser(cmd: CreateUserCommand): Promise<User | undefined> {
  const userExists = await db
    .select({ exists: users.id })
    .from(users)
    .where(eq(users.username, cmd.username))
    .limit(1)
    .then((r) => Boolean(r[0]))

  if (userExists) return

  const hashedPassword = await bcrypt.hash(cmd.password, SALT)

  const record = await db
    .insert(users)
    .values({
      username: cmd.username,
      hashedPassword,
      firstName: cmd.firstName,
      lastName: cmd.lastName,
    })
    .returning()
    .then((r) => r[0]!)

  return toDomain(record)
}
