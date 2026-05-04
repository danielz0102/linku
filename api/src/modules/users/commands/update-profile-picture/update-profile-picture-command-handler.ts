import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { files, users } from "#db/drizzle/schemas.ts"

type UpdateProfilePictureCommand = {
  userId: string
  publicId: string
  publicUrl: string
}

export class UpdateProfilePictureCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: UpdateProfilePictureCommand): Promise<void> {
    const user = await this.getUser(cmd.userId)

    await this.db.transaction(async (tx) => {
      if (!user.profilePictureId) {
        const createdFile = await tx
          .insert(files)
          .values({
            public_id: cmd.publicId,
            publicUrl: cmd.publicUrl,
          })
          .returning({ id: files.id })
          .then((rows) => rows[0]!)

        await tx
          .update(users)
          .set({ profilePictureId: createdFile.id })
          .where(eq(users.id, user.id))

        return
      }

      await tx
        .update(files)
        .set({
          public_id: cmd.publicId,
          publicUrl: cmd.publicUrl,
        })
        .where(eq(files.id, user.profilePictureId))
    })
  }

  private async getUser(userId: string) {
    const user = await this.db
      .select({ id: users.id, profilePictureId: users.profilePictureId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0])

    if (!user) {
      throw new Error("User not found", { cause: { userId } })
    }

    return user
  }
}
