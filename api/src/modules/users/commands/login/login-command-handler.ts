import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { users } from "#db/drizzle/schemas.ts"
import { toPublicData } from "#modules/users/database/user-model.ts"
import type { UserData } from "#modules/users/dtos/user-data.ts"

type LoginCommand = {
  username: string
  password: string
}

export class LoginCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: LoginCommand): Promise<UserData | undefined> {
    const record = await this.db
      .select()
      .from(users)
      .where(eq(users.username, cmd.username))
      .limit(1)
      .then((r) => r[0])

    if (!record) return

    const isValid = await bcrypt.compare(cmd.password, record.hashedPassword)

    if (!isValid) return

    return toPublicData(record)
  }
}
