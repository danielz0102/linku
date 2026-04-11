import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { SALT } from "#env.ts"

type SignUpCommand = {
  username: string
  password: string
  firstName: string
  lastName: string
}

export async function signUp(cmd: SignUpCommand): Promise<string | undefined> {
  const userExists = await db
    .select({ exists: users.id })
    .from(users)
    .where(eq(users.username, cmd.username))
    .limit(1)
    .then((r) => Boolean(r[0]?.exists))

  if (userExists) return

  const hashedPassword = await bcrypt.hash(cmd.password, SALT)

  const id = await db
    .insert(users)
    .values({
      username: cmd.username,
      hashedPassword,
      firstName: cmd.firstName,
      lastName: cmd.lastName,
    })
    .returning({ id: users.id })
    .then((r) => r[0]!.id)

  return id
}
