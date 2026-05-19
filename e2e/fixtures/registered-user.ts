import { randomUUID } from "node:crypto"

import { sql } from "../db/db-client.ts"
import { test as base } from "./api.ts"

export const test = base.extend<{ registeredUser: { username: string; password: string } }>({
  registeredUser: async ({ api }, use) => {
    const username = `test_user_${randomUUID()}`
    const password = "Test@1234"

    await api.post("/users/", {
      data: {
        username,
        firstName: "Test",
        lastName: "User",
        password,
      },
    })

    await use({ username, password })

    await sql`DELETE FROM users WHERE username = ${username}`
  },
})
