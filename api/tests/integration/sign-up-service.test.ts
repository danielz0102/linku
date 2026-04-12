import { randomUUID } from "node:crypto"

import { sql } from "drizzle-orm"

import { db } from "~/db/drizzle/drizzle-client.ts"
import { signUp } from "~/modules/users/commands/sign-up/sign-up-service.ts"

describe("Sign-Up Service", () => {
  afterAll(async () => {
    await db.execute(sql`TRUNCATE TABLE users`)
  })

  it("returns user id", async () => {
    const username = `user-${randomUUID()}`

    const id = await signUp({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect(id).toBeDefined()
  })

  it("returns nothing if the user already exists", async () => {
    const username = `user-${randomUUID()}`

    await signUp({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    const id = await signUp({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect(id).toBeUndefined()
  })
})
