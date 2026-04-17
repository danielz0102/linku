import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { toDomain } from "#modules/users/database/user-model.ts"
import type { User } from "#modules/users/domain/user.ts"

type LoginCommand = {
  username: string
  password: string
}

export async function login(cmd: LoginCommand): Promise<User | undefined> {
  const record = await db
    .select()
    .from(users)
    .where(eq(users.username, cmd.username))
    .limit(1)
    .then((r) => r[0])

  if (!record) return

  const isValid = await bcrypt.compare(cmd.password, record.hashedPassword)

  if (!isValid) return

  return toDomain(record)
}
