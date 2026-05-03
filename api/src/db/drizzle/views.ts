import { eq } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"

import { files, users } from "./schemas.ts"

export const usersView = pgView("users_view").as((qb) => {
  return qb
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      profilePictureUrl: files.public_url,
      bio: users.bio,
    })
    .from(users)
    .leftJoin(files, eq(files.id, users.profilePictureId))
})
