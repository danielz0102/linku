import { randomUUID } from "node:crypto"

import { db } from "#db/drizzle/drizzle-client.ts"
import { UpdateUserCommandHandler } from "#modules/users/commands/update-user/update-user-command-handler.ts"
import { it } from "~/context/create-user.ts"

describe("Update User Command Handler", () => {
  const updateUser = new UpdateUserCommandHandler(db)

  it("returns updated user data", async ({ createUser }) => {
    const user = await createUser()
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
  })

  it("returns nothing if username is not unique", async ({ createUser }) => {
    const existingUsername = "LLinusLLove"
    const [_, user] = await Promise.all([createUser({ username: existingUsername }), createUser()])

    const updatedUser = await updateUser.execute({
      id: user.id,
      username: existingUsername,
      firstName: "New",
      lastName: "Name",
      bio: null,
    })

    expect(updatedUser).toBeUndefined()
  })

  it("update user if username is not changed", async ({ createUser }) => {
    const user = await createUser()

    const updatedUser = await updateUser.execute({
      id: user.id,
      username: user.username,
      firstName: "Jane",
      lastName: "Smith",
      bio: "Updated bio",
    })

    expect(updatedUser).not.toBeUndefined()
  })
})
