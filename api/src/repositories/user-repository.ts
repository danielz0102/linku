import { eq } from "drizzle-orm"
import db from "~/db/drizzle/index.js"
import { usersTable, type NewUser, type User } from "~/db/drizzle/schema.js"

export class UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    return await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)
      .then((r) => r[0])
  }

  async findById(id: string): Promise<User | undefined> {
    return await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1)
      .then((r) => r[0])
  }

  async create(data: NewUser): Promise<User> {
    const [newUser] = await db.insert(usersTable).values(data).returning()

    if (!newUser) {
      throw new Error("Failed to create new user")
    }

    return newUser
  }
}
