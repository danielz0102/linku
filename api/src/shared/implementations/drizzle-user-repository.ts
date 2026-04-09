import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { db as drizzleClient } from "../../db/drizzle/drizzle-client.ts"
import { usersTable } from "../../db/drizzle/schemas.ts"
import type { CreateUserParams, UserRepository } from "../interfaces/user-repository.ts"
import type { User } from "../user.ts"

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: NodePgDatabase = drizzleClient) {}

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1)
    return user ?? null
  }

  async create(user: CreateUserParams): Promise<User> {
    const [createdUser] = await this.db.insert(usersTable).values(user).returning()
    return createdUser!
  }
}

export const userRepo = new DrizzleUserRepository()
