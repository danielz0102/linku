import { randomUUID } from "node:crypto"

import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { SignUpCommandHandler } from "#modules/users/commands/sign-up/sign-up-command-handler.ts"

const it = test.extend("signUp", () => new SignUpCommandHandler(db))

describe("Sign Up Command Handler", () => {
  it("returns created user data", async ({ signUp }) => {
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

  it("returns nothing if the username already exists", async ({ signUp }) => {
    const username = `user-${randomUUID()}`
    await db
      .insert(users)
      .values({ username, hashedPassword: "hash", firstName: "John", lastName: "Doe" })

    const user = await signUp.execute({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect(user).toBeUndefined()

    onTestFinished(async () => {
      await db.delete(users).where(eq(users.username, username))
    })
  })
})
