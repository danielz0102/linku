import type {
  UserFilters,
  NewUser,
  UpdateData,
  UserRepository,
  SearchOptions,
} from "#users/application/ports/user-repository.d.js"
import type { User } from "#users/domain/user.js"

import db from "#shared/db/drizzle/index.js"
import { usersTable } from "#shared/db/drizzle/schemas.js"
import { and, eq, ilike, or } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {
  async create(newUser: NewUser): Promise<User> {
    return db
      .insert(usersTable)
      .values(newUser)
      .returning()
      .then(([row]) => row)
  }

  async findOne(filters: UserFilters): Promise<User | undefined> {
    const entries = Object.entries(filters) as [keyof UserFilters, string][]
    const conditions = entries.map(([k, v]) => eq(usersTable[k], v))

    if (conditions.length === 0) {
      throw new Error("At least one filter must be provided")
    }

    return db
      .select()
      .from(usersTable)
      .where(and(...conditions))
      .limit(1)
      .then((rows) => rows[0])
  }

  async search(
    filters: UserFilters,
    { limit = 20, offset = 0 }: SearchOptions = {}
  ): Promise<User[]> {
    const entries = Object.entries(filters) as [keyof UserFilters, string][]
    const conditions = entries.map(([k, v]) => ilike(usersTable[k], `%${v}%`))

    if (!conditions) {
      throw new Error("At least one filter must be provided")
    }

    return db
      .select()
      .from(usersTable)
      .where(or(...conditions))
      .limit(limit)
      .offset(offset)
      .then((rows) => rows)
  }

  async update(id: string, data: UpdateData): Promise<User> {
    return db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning()
      .then(([row]) => row)
  }
}
