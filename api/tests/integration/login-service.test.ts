import { randomUUID } from "node:crypto"

import { sql } from "drizzle-orm"

import { db } from "~/db/drizzle/drizzle-client.ts"
import { createUser } from "~/modules/users/commands/create-user/create-user-service.ts"
import { login } from "~/modules/users/commands/login/login-service.ts"

describe("Login Service", () => {
  afterAll(async () => {
    await db.execute(sql`TRUNCATE TABLE users`)
  })

  it("returns user id", async () => {
    const username = `user-${randomUUID()}`

    const signedUpId = await createUser({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect.assert(signedUpId !== undefined)

    const id = await login({
      username,
      password: "pass1234",
    })

    expect(id).toBe(signedUpId)
  })

  it("returns nothing if username doesn't exist", async () => {
    const id = await login({
      username: `missing-user-${randomUUID()}`,
      password: "pass1234",
    })

    expect(id).toBeUndefined()
  })

  it("returns nothing if password doesn't match", async () => {
    const username = `user-${randomUUID()}`

    await createUser({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    const id = await login({
      username,
      password: "wrong-password",
    })

    expect(id).toBeUndefined()
  })
})
