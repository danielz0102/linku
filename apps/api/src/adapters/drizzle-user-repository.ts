import db from "#db/drizzle/index.js"
import { usersTable, type UserRecord } from "#db/drizzle/schemas.js"
import type { User } from "#domain/entities/user.d.js"
import type {
  Filters,
  NewUser,
  UserRepository,
} from "#ports/user-repository.d.js"
import { and, eq } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {
  async findBy(filters: Filters): Promise<User | undefined> {
    const keys = Object.keys(filters) as (keyof Filters)[]
    const conditions: ReturnType<typeof eq>[] = []

    if (keys.length === 0) {
      throw new Error("At least one filter must be provided")
    }

    keys.forEach((k) => {
      if (filters[k]) {
        conditions.push(eq(usersTable[k], filters[k]))
      }
    })

    const [user] = await db
      .select()
      .from(usersTable)
      .where(and(...conditions))
      .limit(1)

    return user ? this.toDomain(user) : undefined
  }

  async create(user: NewUser): Promise<User> {
    return db
      .insert(usersTable)
      .values(user)
      .returning()
      .then((res) => this.toDomain(res[0]))
  }

  private toDomain(record: UserRecord): User {
    return {
      id: record.id,
      username: record.username,
      email: record.email,
      hashedPassword: record.hashedPassword ?? undefined,
      firstName: record.firstName,
      lastName: record.lastName,
      profilePicUrl: record.profilePicUrl ?? undefined,
      status: record.status,
      bio: record.bio ?? undefined,
      signUpAt: record.signUpAt,
    }
  }
}
