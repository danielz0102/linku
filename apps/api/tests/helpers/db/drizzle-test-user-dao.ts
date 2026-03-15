import { eq } from "drizzle-orm/sql/expressions/conditions"

import { db } from "~/api/shared/drizzle/db.ts"
import { usersTable } from "~/api/shared/drizzle/schemas.ts"

import type { TestUserDAO } from "./test-user-dao.ts"

type UserRecord = typeof usersTable.$inferSelect

export class DrizzleTestUserDAO implements TestUserDAO<UserRecord> {
  async insert(user: UserRecord): Promise<void> {
    await db.insert(usersTable).values(user)
  }

  async deleteById(id: string): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, id))
  }

  async findByUsername(username: string): Promise<UserRecord | undefined> {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .then(([r]) => r)
  }
}
