import type User from "~/domain/entities/user.js"
import type {
  NewUser,
  UserRepository,
} from "~/domain/repositories/user-repository.js"

import { eq, or } from "drizzle-orm"
import { UserRepositoryError } from "~/domain/repositories/user-repository.js"
import db from "../db/drizzle/index.js"
import { UserModelMapper } from "../db/drizzle/mappers.js"
import { users } from "../db/drizzle/schema.js"

export const DrizzleUserRepository: UserRepository = {
  async register(user: NewUser): Promise<User> {
    const [inserted] = await db.insert(users).values(user).returning()

    if (!inserted) {
      throw new UserRepositoryError("Failed to register user", {
        cause: "No user was inserted into the database",
      })
    }

    return UserModelMapper.toEntity(inserted)
  },
  async exists(email: string, username: string): Promise<boolean> {
    return db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1)
      .then((result) => result.length > 0)
  },
}
