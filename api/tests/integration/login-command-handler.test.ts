import { randomUUID } from "node:crypto"

import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm/sql/expressions/conditions"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { LoginCommandHandler } from "#modules/users/commands/login/login-command-handler.ts"

const it = test.extend("registerUser", async ({}, { onCleanup }) => {
  const username = `user-${randomUUID()}`

  onCleanup(async () => {
    await db.delete(users).where(eq(users.username, username))
  })

  return async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 1)

    const user = await db
      .insert(users)
      .values({
        username,
        hashedPassword,
        firstName: "John",
        lastName: "Doe",
      })
      .returning()
      .then((r) => r[0]!)

    return user
  }
})

describe("Login Command Handler", () => {
  const login = new LoginCommandHandler(db)

  it("returns the same user registered if credentials are valid", async ({ registerUser }) => {
    const password = "pass1234"
    const registeredUser = await registerUser(password)

    const user = await login.execute({ username: registeredUser.username, password })

    expect(user?.id).toEqual(registeredUser.id)
  })

  it("returns nothing if username doesn't exist", async () => {
    const user = await login.execute({
      username: `missing-user-${randomUUID()}`,
      password: "pass1234",
    })

    expect(user).toBeUndefined()
  })

  it("returns nothing if password doesn't match", async ({ registerUser }) => {
    const { username } = await registerUser("correct-password")

    const user = await login.execute({
      username: username,
      password: "wrong-password",
    })

    expect(user).toBeUndefined()
  })
})
