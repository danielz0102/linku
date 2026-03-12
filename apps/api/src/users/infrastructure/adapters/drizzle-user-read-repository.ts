import db from "#shared/db/drizzle/index.js"
import { usersTable } from "#shared/db/drizzle/schemas.js"
import type { PublicUser } from "#users/application/dtos/public-user.js"
import type { UserReadRepository } from "#users/application/ports/user-read-repository.js"
import { ilike, or } from "drizzle-orm"

export class DrizzleUserReadRepository implements UserReadRepository {
  async search(
    query: string,
    limit?: number,
    offset?: number
  ): Promise<PublicUser[]> {
    const statement = db
      .select()
      .from(usersTable)
      .where(
        or(
          ilike(usersTable.username, `%${query}%`),
          ilike(usersTable.firstName, `%${query}%`),
          ilike(usersTable.lastName, `%${query}%`)
        )
      )

    if (limit !== undefined) {
      statement.limit(limit)
    }

    if (offset !== undefined) {
      statement.offset(offset)
    }

    const results = await statement.execute()

    return results.map((row) => ({
      id: row.id,
      username: row.username,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      profilePicUrl: row.profilePicUrl,
      bio: row.bio,
    }))
  }
}
