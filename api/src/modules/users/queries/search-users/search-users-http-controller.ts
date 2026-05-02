import { and, eq, ilike, not, or } from "drizzle-orm"
import type { RequestHandler } from "express"
import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"

const searchUsersQuerySchema = z.object({
  query: z.string().trim().nonempty(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export const searchUsersController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const result = searchUsersQuerySchema.safeParse(req.query)

  if (!result.success) {
    return res.sendValidationError(result.error.issues)
  }

  const { query, page, limit } = result.data
  const offset = (page - 1) * limit
  const pattern = `%${query}%`

  const foundUsers = await db
    .select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      profilePictureUrl: users.profilePictureUrl,
      bio: users.bio,
    })
    .from(users)
    .where(
      and(
        or(
          ilike(users.username, pattern),
          ilike(users.firstName, pattern),
          ilike(users.lastName, pattern)
        ),
        not(eq(users.id, userId))
      )
    )
    .limit(limit)
    .offset(offset)

  return res.json(foundUsers)
}
