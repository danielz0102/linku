import { randomUUID } from "node:crypto"

import { users } from "#db/drizzle/schemas.ts"
import { SignUpCommandHandler } from "#modules/users/commands/sign-up/sign-up-command-handler.ts"

import { it as base } from "../helpers/db-context.ts"

const it = base.extend("signUp", ({ db }) => new SignUpCommandHandler(db))

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
  })

  it("returns nothing if the username already exists", async ({ signUp, db }) => {
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
  })
})
