import { randomUUID } from "node:crypto"

import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { SignUpCommandHandler } from "#modules/users/commands/sign-up/sign-up-command-handler.ts"
import { it } from "~/context/create-user.ts"

describe("Sign Up Command Handler", () => {
  const signUp = new SignUpCommandHandler(db)

  it("returns created user data", async () => {
    const username = `user-${randomUUID()}`

    const user = await signUp.execute({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect(user).toBeDefined()

    onTestFinished(async () => {
      await db.delete(users).where(eq(users.username, username))
    })
  })

  it("returns nothing if the username already exists", async ({ createUser }) => {
    const { username } = await createUser({ username: "existing-user" })

    const user = await signUp.execute({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect(user).toBeUndefined()
  })
})
