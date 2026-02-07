import type {
  Filters,
  NewUser,
  UserRepository,
} from "#users/interfaces/user-repository.d.js"
import type { User } from "#users/types.d.js"

import db from "#db/drizzle/index.js"
import { usersTable } from "#db/drizzle/schemas.js"
import { and, eq } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {
  async create(newUser: NewUser): Promise<User> {
    return db
      .insert(usersTable)
      .values(newUser)
      .returning()
      .then(([row]) => row)
  }

  async search({ id, username, email }: Filters): Promise<User | undefined> {
    const conditions = []

    if (id) {
      conditions.push(eq(usersTable.id, id))
    }
    if (email) {
      conditions.push(eq(usersTable.email, email))
    }
    if (username) {
      conditions.push(eq(usersTable.username, username))
    }

    if (conditions.length === 0) {
      return undefined
    }

    return db
      .select()
      .from(usersTable)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions))
      .limit(1)
      .then((rows) => rows[0])
  }
}
