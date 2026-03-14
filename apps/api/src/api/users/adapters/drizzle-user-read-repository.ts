import { ilike, or } from "drizzle-orm"

import type { PublicUser } from "#core/use-cases/dtos/public-user.js"
import type {
  UserReadRepository,
  UserFilters,
  Pagination,
} from "#core/use-cases/ports/user-read-repository.d.js"

import { db } from "#api/shared/drizzle/db.js"
import { usersTable } from "#api/shared/drizzle/schemas.js"

export class DrizzleUserReadRepository implements UserReadRepository {
  async search(filters: UserFilters, pagination: Pagination): Promise<PublicUser[]> {
    const whereClause = or(
      filters.username ? ilike(usersTable.username, `%${filters.username}%`) : undefined,
      filters.firstName ? ilike(usersTable.firstName, `%${filters.firstName}%`) : undefined,
      filters.lastName ? ilike(usersTable.lastName, `%${filters.lastName}%`) : undefined
    )

    const query = db.select().from(usersTable)

    if (whereClause) {
      query.where(whereClause)
    }

    if (pagination.limit !== undefined) {
      query.limit(pagination.limit)
    }

    if (pagination.offset !== undefined) {
      query.offset(pagination.offset)
    }

    const users = await query.execute()

    return users.map(({ hashedPassword: _, ...rest }) => ({
      ...rest,
    }))
  }
}
