import type {
  NewUser,
  UserRepository,
} from "~/domain/repositories/user-repository.js"

import User from "~/domain/entities/user.js"
import { UserRepositoryError } from "~/domain/errors.js"
import db from "../db/drizzle/index.js"
import { UserModelMapper } from "../db/drizzle/mappers.js"
import { users } from "../db/drizzle/schema.js"

export class DrizzleUserRepository implements UserRepository {
  async register(user: NewUser): Promise<User> {
    const [inserted] = await db.insert(users).values(user).returning()

    if (!inserted) {
      throw new UserRepositoryError("Failed to register user", {
        cause: "No user was inserted into the database",
      })
    }

    return UserModelMapper.toEntity(inserted)
  }
}
