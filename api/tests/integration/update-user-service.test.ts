import { randomUUID } from "node:crypto"

import { eq, sql } from "drizzle-orm"

import { db } from "~/db/drizzle/drizzle-client.ts"
import { users } from "~/db/drizzle/schemas.ts"
import { createUser } from "~/modules/users/commands/create-user/create-user-service.ts"
import { updateUser } from "~/modules/users/commands/update-user/update-user-service.ts"

describe("Update User Service", () => {
  afterAll(async () => {
    await db.execute(sql`TRUNCATE TABLE users`)
  })

  it("returns true if updating succeed", async () => {
    const username = `user-${randomUUID()}`

    const id = await createUser({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect.assert(id !== undefined)

    const updatedUsername = `updated-${randomUUID()}`
    const updatedFirstName = "Jane"
    const updatedLastName = "Smith"
    const updatedProfilePictureUrl = "https://example.com/avatar.png"
    const updatedBio = "Updated bio"

    const ok = await updateUser({
      id,
      username: updatedUsername,
      firstName: updatedFirstName,
      lastName: updatedLastName,
      profilePictureUrl: updatedProfilePictureUrl,
      bio: updatedBio,
    })

    expect(ok).toBe(true)

    const updatedUser = await db
      .select({
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        profilePictureUrl: users.profilePictureUrl,
        bio: users.bio,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .then((r) => r[0])

    expect(updatedUser).toEqual({
      username: updatedUsername,
      firstName: updatedFirstName,
      lastName: updatedLastName,
      profilePictureUrl: updatedProfilePictureUrl,
      bio: updatedBio,
    })
  })

  it("returns false if username is not unique", async () => {
    const firstUsername = `user-${randomUUID()}`
    const secondUsername = `user-${randomUUID()}`

    const firstId = await createUser({
      username: firstUsername,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    const secondId = await createUser({
      username: secondUsername,
      password: "pass1234",
      firstName: "Alice",
      lastName: "Cooper",
    })

    expect.assert(firstId !== undefined)
    expect.assert(secondId !== undefined)

    const ok = await updateUser({
      id: firstId,
      username: secondUsername,
      firstName: "New",
      lastName: "Name",
      profilePictureUrl: "https://example.com/new-avatar.png",
      bio: "This should not be saved",
    })

    expect(ok).toBe(false)

    const unchangedUser = await db
      .select({
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        profilePictureUrl: users.profilePictureUrl,
        bio: users.bio,
      })
      .from(users)
      .where(eq(users.id, firstId))
      .limit(1)
      .then((r) => r[0])

    expect(unchangedUser).toEqual({
      username: firstUsername,
      firstName: "John",
      lastName: "Doe",
      profilePictureUrl: null,
      bio: null,
    })
  })
})
