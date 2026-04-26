import { randomUUID } from "node:crypto"

import { users } from "#db/drizzle/schemas.ts"
import { UpdateUserCommandHandler } from "#modules/users/commands/update-user/update-user-command-handler.ts"

import { it as base } from "../helpers/db-context.ts"

const it = base.extend("updateUser", ({ db }) => new UpdateUserCommandHandler(db))

describe("Update User Command Handler", () => {
  it("returns updated user data", async ({ db, updateUser }) => {
    const user = await db
      .insert(users)
      .values({
        username: `user-${randomUUID()}`,
        hashedPassword: "hashedpassword",
        firstName: "John",
        lastName: "Doe",
      })
      .returning()
      .then((r) => r[0]!)
    const newUserData = {
      username: `updated-${randomUUID()}`,
      firstName: "Jane",
      lastName: "Smith",
      profilePictureUrl: "https://example.com/avatar.png",
      bio: "Updated bio",
    }

    const updatedUser = await updateUser.execute({
      id: user.id,
      ...newUserData,
    })

    expect(updatedUser).toMatchObject(newUserData)
  })

  it("returns nothing if username is not unique", async ({ db, updateUser }) => {
    const username = `user-${randomUUID()}`
    const anotherUsername = `user-${randomUUID()}`
    const [_, userId] = await Promise.all([
      db.insert(users).values({
        username: anotherUsername,
        hashedPassword: "hashed",
        firstName: "Existing",
        lastName: "User",
      }) as unknown,
      db
        .insert(users)
        .values({
          username,
          hashedPassword: "hashed",
          firstName: "John",
          lastName: "Doe",
        })
        .returning({ id: users.id })
        .then((r) => r[0]!.id),
    ])

    const updatedUser = await updateUser.execute({
      id: userId,
      username: anotherUsername,
      firstName: "New",
      lastName: "Name",
      profilePictureUrl: null,
      bio: null,
    })

    expect(updatedUser).toBeUndefined()
  })

  it("update user if username is not changed", async ({ db, updateUser }) => {
    const user = await db
      .insert(users)
      .values({
        username: `user-${randomUUID()}`,
        hashedPassword: "hashedpassword",
        firstName: "John",
        lastName: "Doe",
      })
      .returning()
      .then((r) => r[0]!)

    const updatedUser = await updateUser.execute({
      id: user.id,
      username: user.username,
      firstName: "Jane",
      lastName: "Smith",
      profilePictureUrl: "https://example.com/avatar.png",
      bio: "Updated bio",
    })

    expect(updatedUser).not.toBeUndefined()
  })
})
