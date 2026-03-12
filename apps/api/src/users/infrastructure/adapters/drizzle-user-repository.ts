import type {
  NewUser,
  UpdateData,
  UserFilters,
  UserRepository,
} from "#users/domain/user-repository.js"
import { User } from "#users/domain/user.js"
import type { Criteria } from "#shared/domain/criteria.js"

import db from "#shared/db/drizzle/index.js"
import { usersTable } from "#shared/db/drizzle/schemas.js"
import { buildDrizzleWhere } from "#shared/db/drizzle/criteria.js"
import { eq } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {
  async create(newUser: NewUser): Promise<User> {
    return db
      .insert(usersTable)
      .values(newUser)
      .returning()
      .then(([u]) => new User(u))
  }

  async matching(criteria: Criteria<UserFilters>): Promise<User[]> {
    const { limit = 20, offset = 0 } = criteria
    const where = buildDrizzleWhere(criteria, {
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
    })

    return db
      .select()
      .from(usersTable)
      .where(where)
      .limit(limit)
      .offset(offset)
      .then((rows) => rows.map((r) => new User(r)))
  }

  async update(id: string, data: UpdateData): Promise<User> {
    return db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning()
      .then(([r]) => new User(r))
  }

  async save(user: User): Promise<void> {
    const {
      id,
      username,
      email,
      hashedPassword,
      firstName,
      lastName,
      profilePicUrl,
      bio,
    } = user.toPrimitives()

    await db
      .insert(usersTable)
      .values({
        id: id,
        username: username,
        email: email,
        hashedPassword: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        profilePicUrl: profilePicUrl,
        bio: bio,
      })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: {
          username: username,
          email: email,
          hashedPassword: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          profilePicUrl: profilePicUrl,
          bio: bio,
        },
      })
  }
}
