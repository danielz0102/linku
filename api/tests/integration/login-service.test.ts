import { randomUUID } from "node:crypto"

import bcrypt from "bcryptjs"
import { sql } from "drizzle-orm"

import { db } from "~/db/drizzle/drizzle-client.ts"
import { users } from "~/db/drizzle/schemas.ts"
import { login } from "~/modules/users/commands/login/login-service.ts"
import { toDomain } from "~/modules/users/database/user-model.ts"

describe("Login Service", () => {
  afterAll(async () => {
    await db.execute(sql`TRUNCATE TABLE users`)
  })

  it("returns user data", async () => {
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

    const user = await login({ username: registeredUser.username, password })

    expect(user).toEqual(registeredUser)
  })

  it("returns nothing if username doesn't exist", async () => {
    const user = await login({
      username: `missing-user-${randomUUID()}`,
      password: "pass1234",
    })

    expect(user).toBeUndefined()
  })

  it("returns nothing if password doesn't match", async () => {
    const username = `user-${randomUUID()}`
    const hashedPassword = await bcrypt.hash("pass1234", 1)
    await db.insert(users).values({
      username: `user-${randomUUID()}`,
      hashedPassword,
      firstName: "John",
      lastName: "Doe",
    })

    const user = await login({
      username,
      password: "wrong-password",
    })

    expect(user).toBeUndefined()
  })
})
