import { and, eq, not, or, type SQL } from "drizzle-orm"

import type { UniqueField, UserRepository, UniqueFields } from "#core/users/user-repository.js"

import { Email } from "#core/users/email.js"
import { User } from "#core/users/user.js"
import { UUID } from "#core/uuid.js"

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

  async findOne(field: UniqueField): Promise<User | undefined> {
    const condition = this.uniqueFieldToCondition(field)

    return db
      .select()
      .from(usersTable)
      .where(condition)
      .then(([r]) => (r ? new User(r) : undefined))
  }

  async findExisting(fields: Partial<UniqueFields>): Promise<User | undefined> {
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

  private uniqueFieldToCondition(field: UniqueField): SQL {
    if (typeof field === "string") {
      return eq(usersTable.username, field)
    }

    if (field instanceof UUID) {
      return eq(usersTable.id, field.value)
    }

    if (field instanceof Email) {
      return eq(usersTable.email, field.value)
    }

    throw new Error("Invalid unique field")
  }
}
