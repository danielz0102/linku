import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { users } from "#db/drizzle/schemas.ts"
import { toDomain } from "#modules/users/database/user-model.ts"
import type { User } from "#modules/users/domain/user.ts"

type LoginCommand = {
  username: string
  password: string
}

export class LoginService {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: LoginCommand): Promise<User | undefined> {
    const record = await this.db
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
}
