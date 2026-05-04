import { randomUUID } from "crypto"

import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { files, users } from "#db/drizzle/schemas.ts"
import { usersView } from "#db/drizzle/views.ts"
import { UpdateProfilePictureCommandHandler } from "#modules/users/commands/update-profile-picture/update-profile-picture-command-handler.ts"

describe("Update Profile Picture Command Handler", () => {
  const updatePicture = new UpdateProfilePictureCommandHandler(db)

  it("updates the profile picture of a user", async () => {
    const newProfilePictureUrl = "https://example.com/new-profile-picture.jpg"
    const userId = await db
      .insert(users)
      .values({
        username: `user-${randomUUID()}`,
        hashedPassword: await bcrypt.hash("pass1234", 1),
        firstName: "John",
        lastName: "Doe",
        profilePictureId: null,
      })
      .returning({ id: users.id })
      .then((r) => r[0]!.id)

    await updatePicture.execute({
      userId,
      publicId: `user-${userId}`,
      publicUrl: newProfilePictureUrl,
    })

    const user = await db
      .select({ profilePictureUrl: usersView.profilePictureUrl })
      .from(usersView)
      .where(eq(usersView.id, userId))
      .then((r) => r[0]!)

    expect(user.profilePictureUrl).toEqual(newProfilePictureUrl)

    onTestFinished(async () => {
      await Promise.all([
        db.delete(users).where(eq(users.id, userId)),
        db.delete(files).where(eq(files.publicUrl, newProfilePictureUrl)),
      ])
    })
  })

  it("throws if the user does not exist", async () => {
    const nonExistentUserId = randomUUID()

    await expect(() =>
      updatePicture.execute({
        userId: nonExistentUserId,
        publicId: `user-${nonExistentUserId}`,
        publicUrl: "https://example.com/new-profile-picture.jpg",
      })
    ).rejects.toThrow()
  })
})
