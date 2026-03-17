import { PasswordHasherMock } from "~tests/helpers/adapters/password-hasher-mock.ts"
import { InMemoryUserRepository } from "~tests/helpers/users/in-memory-user-repository.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

import { toPublicUser } from "../dtos/public-user.ts"
import { Login } from "../login-use-case.ts"

let users: InMemoryUserRepository
let hasher: PasswordHasherMock
let login: Login

describe("LoginUseCase", () => {
  beforeEach(() => {
    users = new InMemoryUserRepository()
    hasher = new PasswordHasherMock()
    login = new Login({ userRepo: users, hasher })
  })

  it("returns a public user", async () => {
    const user = UserMother.create()
    await users.save(user)
    hasher.compare.mockResolvedValue(true)

    const result = await login.execute({ username: user.username, password: "plain-password" })

    expect(result).toEqual({ ok: true, data: toPublicUser(user) })
  })

  it("fails if the user doesn't exist", async () => {
    const result = await login.execute({
      username: "missing-user",
      password: "plain-password",
    })

    expect(result).toEqual({ ok: false, error: "INVALID_CREDENTIALS" })
  })

  it("fails if the password is invalid", async () => {
    const user = UserMother.create()
    await users.save(user)
    hasher.compare.mockResolvedValue(false)

    const result = await login.execute({ username: user.username, password: "invalid-password" })

    expect(result).toEqual({ ok: false, error: "INVALID_CREDENTIALS" })
  })
})
