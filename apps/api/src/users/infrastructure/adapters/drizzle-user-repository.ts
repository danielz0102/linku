import type {
  NewUser,
  UpdateData,
  UserRepository,
} from "#users/application/ports/user-repository.d.js"
import type { Criteria } from "#shared/domain/criteria.js"
import { User } from "#users/domain/user.js"

import db from "#shared/db/drizzle/index.js"
import { usersTable } from "#shared/db/drizzle/schemas.js"
import { eq } from "drizzle-orm"
import { CriteriaToDrizzleConverter } from "./criteria-to-drizzle-converter.js"

const converter = new CriteriaToDrizzleConverter()

const DEFAULT_LIMIT = 20
const DEFAULT_OFFSET = 0

export class DrizzleUserRepository implements UserRepository {
  async create(newUser: NewUser): Promise<User> {
    return db
      .insert(usersTable)
      .values(newUser)
      .returning()
      .then(([u]) => new User(u))
  }

  async matching(criteria: Criteria): Promise<User[]> {
    const { where, limit, offset } = converter.convert(criteria)

    return db
      .select()
      .from(usersTable)
      .where(where)
      .limit(limit ?? DEFAULT_LIMIT)
      .offset(offset ?? DEFAULT_OFFSET)
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
}
