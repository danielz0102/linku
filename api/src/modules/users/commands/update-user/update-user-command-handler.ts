import { and, eq, not } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { users } from "#db/drizzle/schemas.ts"
import { usersView } from "#db/drizzle/views.ts"
import type { UserData } from "#modules/users/dtos/user-data.ts"

type UpdateUserCommand = {
  id: string
  username: string
  firstName: string
  lastName: string
  bio: string | null
}

export class UpdateUserCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: UpdateUserCommand): Promise<UserData | undefined> {
    const isUnique = await this.db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.username, cmd.username), not(eq(users.id, cmd.id))))
      .then((r) => r.length === 0)

    if (!isUnique) return

    await this.db.update(users).set(cmd).where(eq(users.id, cmd.id))

    const user = await this.db
      .select()
      .from(usersView)
      .where(eq(usersView.id, cmd.id))
      .then((r) => r[0]!)

    return user
  }
}
