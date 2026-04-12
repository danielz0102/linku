import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"

type LoginCommand = {
  username: string
  password: string
}

export async function login(cmd: LoginCommand): Promise<string | undefined> {
  const user = await db
    .select({ id: users.id, hash: users.hashedPassword })
    .from(users)
    .where(eq(users.username, cmd.username))
    .limit(1)
    .then((r) => r[0])

  if (!user) return

  const isValid = await bcrypt.compare(cmd.password, user.hash)

  if (!isValid) return

  return user.id
}
