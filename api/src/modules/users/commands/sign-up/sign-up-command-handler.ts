import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { users } from "#db/drizzle/schemas.ts"
import { SALT } from "#env.ts"
import { toPublicData } from "#modules/users/database/user-model.ts"
import type { UserData } from "#modules/users/dtos/user-data.ts"

type CreateUserCommand = {
  username: string
  password: string
  firstName: string
  lastName: string
}

export class SignUpCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: CreateUserCommand): Promise<UserData | undefined> {
    const userExists = await this.db
      .select({ exists: users.id })
      .from(users)
      .where(eq(users.username, cmd.username))
      .limit(1)
      .then((r) => Boolean(r[0]))

    if (userExists) return

    const hashedPassword = await bcrypt.hash(cmd.password, SALT)

    const record = await this.db
      .insert(users)
      .values({
        username: cmd.username,
        hashedPassword,
        firstName: cmd.firstName,
        lastName: cmd.lastName,
      })
      .returning()
      .then((r) => r[0]!)

    return toPublicData(record)
  }
}
