import { randomUUID } from "node:crypto"

import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { UpdateUserCommandHandler } from "#modules/users/commands/update-user/update-user-command-handler.ts"

describe("Update User Command Handler", () => {
  const updateUser = new UpdateUserCommandHandler(db)

  it("returns updated user data", async () => {
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
      bio: "Updated bio",
    }

    const updatedUser = await updateUser.execute({
      id: user.id,
      ...newUserData,
    })

    expect(updatedUser).toMatchObject(newUserData)

    onTestFinished(async () => {
      await db.delete(users).where(eq(users.id, user.id))
    })
  })

  it("returns nothing if username is not unique", async () => {
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
      bio: null,
    })

    expect(updatedUser).toBeUndefined()

    onTestFinished(async () => {
      await db.delete(users).where(eq(users.username, anotherUsername))
      await db.delete(users).where(eq(users.id, userId))
    })
  })

  it("update user if username is not changed", async () => {
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
      bio: "Updated bio",
    })

    expect(updatedUser).not.toBeUndefined()

    onTestFinished(async () => {
      await db.delete(users).where(eq(users.id, user.id))
    })
  })
})
