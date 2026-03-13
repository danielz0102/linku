import db from "#shared/db/drizzle/index.js"
import { usersTable } from "#shared/db/drizzle/schemas.js"
import type {
  UniqueFields,
  UserRepository,
} from "#users/domain/user-repository.js"
import { User } from "#users/domain/user.js"
import { and, eq, not, or } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const data = user.toPrimitives()
    const { id: _, ...dataWithoutId } = data

    await db.insert(usersTable).values(data).onConflictDoUpdate({
      target: usersTable.id,
      set: dataWithoutId,
    })
  }

  async findExisting({
    id,
    username,
    email,
  }: Partial<UniqueFields>): Promise<User | undefined> {
    if (!username && !email && !id) {
      throw new Error("At least one filter must be provided")
    }

    return db
      .select()
      .from(usersTable)
      .where(
        and(
          id ? eq(usersTable.id, id.value) : undefined,
          username ? eq(usersTable.username, username) : undefined,
          email ? eq(usersTable.email, email.value) : undefined
        )
      )
      .then(([r]) => (r ? new User(r) : undefined))
  }

  async checkUniqueness({
    id,
    username,
    email,
  }: Partial<UniqueFields>): Promise<User | undefined> {
    if (!username && !email && !id) {
      throw new Error("At least one filter must be provided")
    }

    return db
      .select()
      .from(usersTable)
      .where(
        and(
          id ? not(eq(usersTable.id, id.value)) : undefined,
          or(
            username ? eq(usersTable.username, username) : undefined,
            email ? eq(usersTable.email, email.value) : undefined
          )
        )
      )
      .then(([r]) => (r ? new User(r) : undefined))
  }
}
