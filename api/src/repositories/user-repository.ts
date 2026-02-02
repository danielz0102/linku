import db from "#db/drizzle/index.js"
import { usersTable } from "#db/drizzle/schemas.js"
import { eq, or } from "drizzle-orm"

type User = typeof usersTable.$inferSelect
type NewUser = typeof usersTable.$inferInsert

export const UserRepository = {
  async create(newUser: NewUser): Promise<User> {
    return db
      .insert(usersTable)
      .values(newUser)
      .returning()
      .then(([row]) => row)
  },

  async exists(filters: Pick<User, "email" | "username">): Promise<boolean> {
    const { email, username } = filters

    return db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.username, username), eq(usersTable.email, email)))
      .limit(1)
      .then((rows) => rows.length > 0)
  },
}
