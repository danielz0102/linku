import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { files, users } from "#db/drizzle/schemas.ts"
import type { UserData } from "#modules/users/dtos/user-data.ts"

type LoginCommand = {
  username: string
  password: string
}

export class LoginCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: LoginCommand): Promise<UserData | undefined> {
    const user = await this.db
      .select({
        id: users.id,
        username: users.username,
        hashedPassword: users.hashedPassword,
        firstName: users.firstName,
        lastName: users.lastName,
        profilePictureUrl: files.public_url,
        bio: users.bio,
      })
      .from(users)
      .leftJoin(files, eq(files.id, users.profilePictureId))
      .where(eq(users.username, cmd.username))
      .limit(1)
      .then((r) => r[0])

    if (!user) return

    const isValid = await bcrypt.compare(cmd.password, user.hashedPassword)

    if (!isValid) return

    const { hashedPassword: _, ...rest } = user

    return rest
  }
}
