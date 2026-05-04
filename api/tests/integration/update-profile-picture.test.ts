import { randomUUID } from "crypto"

import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { usersView } from "#db/drizzle/views.ts"
import { UpdateProfilePictureCommandHandler } from "#modules/users/commands/update-profile-picture/update-profile-picture-command-handler.ts"
import { it } from "~/context/create-user.ts"

describe("Update Profile Picture Command Handler", () => {
  const updatePicture = new UpdateProfilePictureCommandHandler(db)

  it("updates the profile picture of a user", async ({ createUser }) => {
    const newProfilePictureUrl = "https://example.com/new-profile-picture.jpg"
    const { id: userId } = await createUser()

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
