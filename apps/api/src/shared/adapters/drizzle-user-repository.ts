import { and, eq, not, or, type SQL } from "drizzle-orm"

import type {
  ConflictCheckFields,
  UniqueField,
  UserRepository,
} from "#core/users/user-repository.js"

import { Email } from "#core/users/email.js"
import { User } from "#core/users/user.js"
import { UUID } from "#core/uuid.js"

import { db, type Database } from "../../db/drizzle/drizzle-client.js"
import { usersTable } from "../../db/drizzle/schemas.js"

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly database: Database = db) {}

  async save(user: User): Promise<void> {
    const data = user.toPrimitives()
    const { id: _, ...dataWithoutId } = data

    await this.database.insert(usersTable).values(data).onConflictDoUpdate({
      target: usersTable.id,
      set: dataWithoutId,
    })
  }

  async findOne(field: UniqueField): Promise<User | undefined> {
    const condition = this.uniqueFieldToCondition(field)

    return this.database
      .select()
      .from(usersTable)
      .where(condition)
      .then(([r]) => (r ? new User(r) : undefined))
  }

  async findConflict({ excludedId, username, email }: ConflictCheckFields) {
    const usernameCondition = eq(usersTable.username, username)
    const emailCondition = eq(usersTable.email, email.value)
    const excludeCondition = excludedId ? not(eq(usersTable.id, excludedId.value)) : undefined

    const results = await this.database
      .select()
      .from(usersTable)
      .where(and(excludeCondition, or(usernameCondition, emailCondition)))

    if (results.length === 0) return undefined

    return {
      usernameExists: results.some((r) => r.username === username),
      emailExists: results.some((r) => r.email === email.value),
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
