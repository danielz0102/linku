import { eq } from "drizzle-orm/sql/expressions/conditions"
import { reset } from "drizzle-seed"

import { db } from "~/api/shared/drizzle/db.ts"
import { usersTable } from "~/api/shared/drizzle/schemas.ts"
import { User } from "~/core/users/user.ts"

import type { TestUserDAO } from "./test-user-dao.ts"

export class DrizzleTestUserDAO implements TestUserDAO {
  async insert(user: User): Promise<void> {
    await db.insert(usersTable).values(user.toPrimitives())
  }

  async deleteById(id: string): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, id))
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .then(([r]) => (r ? new User(r) : undefined))
  }

  async reset(): Promise<void> {
    await reset(db, usersTable)
  }
}
