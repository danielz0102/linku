import { randomUUID } from "node:crypto"

import { db } from "#db/drizzle/drizzle-client.ts"
import { LoginCommandHandler } from "#modules/users/commands/login/login-command-handler.ts"
import { it } from "~/context/create-user.ts"

describe("Login Command Handler", () => {
  const login = new LoginCommandHandler(db)

  it("returns the same user registered if credentials are valid", async ({ createUser }) => {
    const password = "pass1234"
    const registeredUser = await createUser({ password })

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

  it("returns nothing if password doesn't match", async ({ createUser }) => {
    const { username } = await createUser({ password: "correct-password" })

    const user = await login.execute({
      username: username,
      password: "wrong-password",
    })

    expect(user).toBeUndefined()
  })
})
