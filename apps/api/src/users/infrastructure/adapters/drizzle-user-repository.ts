import type {
  Filters,
  NewUser,
  UpdateData,
  UserRepository,
} from "#users/application/ports/user-repository.d.js"
import type { User } from "#users/domain/user.js"

import db from "#shared/db/drizzle/index.js"
import { usersTable } from "#shared/db/drizzle/schemas.js"
import { and, eq } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {
  async create(newUser: NewUser): Promise<User> {
    return db
      .insert(usersTable)
      .values(newUser)
      .returning()
      .then(([row]) => row)
  }

  async exists(filters: Filters): Promise<boolean> {
    const { id, username, email } = filters
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
      return false
    }

    return db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions))
      .limit(1)
      .then((rows) => rows.length > 0)
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

  async update(id: string, data: UpdateData): Promise<User> {
    return db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning()
      .then(([row]) => row)
  }
}
