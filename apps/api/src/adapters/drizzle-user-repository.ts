import db from "#db/drizzle/index.js"
import { usersTable, type UserRecord } from "#db/drizzle/schemas.js"
import type { Filters, UserRepository } from "#ports/user-repository.d.js"
import { and, eq } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {
  async findBy(filters: Filters): Promise<UserRecord | undefined> {
    const keys = Object.keys(filters) as (keyof Filters)[]
    const conditions: ReturnType<typeof eq>[] = []

    if (keys.length === 0) {
      throw new Error("At least one filter must be provided")
    }

    keys.forEach((k) => {
      if (filters[k]) {
        conditions.push(eq(usersTable[k], filters[k]))
      }
    })

    const [user] = await db
      .select()
      .from(usersTable)
      .where(and(...conditions))
      .limit(1)

    return user
  }
}
