import User from "~/domain/entities/user.js"
import { UserRepository } from "~/domain/repositories/user-repository.js"
import { users } from "../db/drizzle/schema.js"
import db from "../db/drizzle/index.js"

export class DrizzleUserRepository implements UserRepository {
  async register(user: User): Promise<User> {
    await db.insert(users).values({
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      profilePicUrl: user.profilePicUrl,
    })

    return user
  }
}
