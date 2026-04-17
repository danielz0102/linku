import { randomUUID } from "node:crypto"

import { sql } from "drizzle-orm"

import { db } from "~/db/drizzle/drizzle-client.ts"
import { users } from "~/db/drizzle/schemas.ts"
import { createUser } from "~/modules/users/commands/create-user/create-user-service.ts"

describe("Create User Service", () => {
  afterAll(async () => {
    await db.execute(sql`TRUNCATE TABLE users`)
  })

  it("returns created user data", async () => {
    const username = `user-${randomUUID()}`

    const user = await createUser({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect(user).toBeDefined()
  })

  it("returns nothing if the username already exists", async () => {
    const username = `user-${randomUUID()}`
    await db
      .insert(users)
      .values({ username, hashedPassword: "hash", firstName: "John", lastName: "Doe" })

    const id = await createUser({
      username,
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
    })

    expect(id).toBeUndefined()
  })
})
