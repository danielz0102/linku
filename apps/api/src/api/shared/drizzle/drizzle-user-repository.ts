import type { UserRepository, UniqueFields } from "#core/users/user-repository.js"

import { User } from "#core/users/user.js"
import { and, eq, not, or, type SQL } from "drizzle-orm"

import { db } from "./db.js"
import { usersTable } from "./schemas.js"

export class DrizzleUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const data = user.toPrimitives()
    const { id: _, ...dataWithoutId } = data

    await db.insert(usersTable).values(data).onConflictDoUpdate({
      target: usersTable.id,
      set: dataWithoutId,
    })
  }

  async findExisting(fields: Partial<UniqueFields>): Promise<User | undefined> {
    const conditions = this.uniqueFieldsToConditions(fields)

    return db
      .select()
      .from(usersTable)
      .where(and(...Object.values(conditions)))
      .then(([r]) => (r ? new User(r) : undefined))
  }

  async checkUniqueness(fields: Partial<UniqueFields>): Promise<User | undefined> {
    const { id, username, email } = this.uniqueFieldsToConditions(fields)

    return db
      .select()
      .from(usersTable)
      .where(and(id ? not(id) : undefined, or(username, email)))
      .then(([r]) => (r ? new User(r) : undefined))
  }

  private uniqueFieldsToConditions({ id, username, email }: Partial<UniqueFields>): Partial<{
    id: SQL
    username: SQL
    email: SQL
  }> {
    if (!username && !email && !id) {
      throw new Error("At least one filter must be provided")
    }

    return {
      id: id ? eq(usersTable.id, id.value) : undefined,
      username: username ? eq(usersTable.username, username) : undefined,
      email: email ? eq(usersTable.email, email.value) : undefined,
    }
  }
}
