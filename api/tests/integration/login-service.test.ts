import { randomUUID } from "node:crypto"

import bcrypt from "bcryptjs"

import { users } from "~/db/drizzle/schemas.ts"
import { LoginService } from "~/modules/users/commands/login/login-service.ts"
import { toDomain } from "~/modules/users/database/user-model.ts"

import { it as base } from "../helpers/db-context.ts"

const it = base.extend("login", ({ db }) => new LoginService(db))

describe("Login Service", () => {
  it("returns user data", async ({ db, login }) => {
    const password = "pass1234"
    const registeredUser = await db
      .insert(users)
      .values({
        username: `user-${randomUUID()}`,
        hashedPassword: await bcrypt.hash(password, 1),
        firstName: "John",
        lastName: "Doe",
      })
      .returning()
      .then((r) => toDomain(r[0]!))

    const user = await login.execute({ username: registeredUser.username, password })

    expect(user).toEqual(registeredUser)
  })

  it("returns nothing if username doesn't exist", async ({ login }) => {
    const user = await login.execute({
      username: `missing-user-${randomUUID()}`,
      password: "pass1234",
    })

    expect(user).toBeUndefined()
  })

  it("returns nothing if password doesn't match", async ({ db, login }) => {
    const username = `user-${randomUUID()}`
    const hashedPassword = await bcrypt.hash("pass1234", 1)
    await db.insert(users).values({
      username,
      hashedPassword,
      firstName: "John",
      lastName: "Doe",
    })

    const user = await login.execute({
      username,
      password: "wrong-password",
    })

    expect(user).toBeUndefined()
  })
})
