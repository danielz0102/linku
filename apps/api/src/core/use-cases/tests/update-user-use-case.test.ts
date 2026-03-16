import { Result } from "~/core/result.ts"
import { UpdateUserUseCase } from "~/core/use-cases/update-user-use-case.ts"
import { InMemoryUserRepository } from "~tests/helpers/users/in-memory-user-repository.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

describe("UpdateUserUseCase", () => {
  let users: InMemoryUserRepository
  let updateUser: UpdateUserUseCase

  beforeEach(() => {
    users = new InMemoryUserRepository()
    updateUser = new UpdateUserUseCase(users)
  })

  it("returns a public user", async () => {
    const user = UserMother.create()
    await users.save(user)

    const result = await updateUser.execute(user.id, {
      firstName: "Updated",
      lastName: "Name",
    })

    expect(result).toMatchObject(
      Result.ok({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: "Updated",
        lastName: "Name",
      })
    )
  })

  it("fails if username is already taken", async () => {
    const user = UserMother.create()
    const existing = UserMother.create()
    await users.save(user)
    await users.save(existing)

    const result = await updateUser.execute(user.id, {
      username: existing.username,
    })

    expect(result).toEqual(Result.fail({ username: "USERNAME_TAKEN", email: undefined }))
  })

  it("fails if email is already taken", async () => {
    const user = UserMother.create()
    const existing = UserMother.create()
    await users.save(user)
    await users.save(existing)

    const result = await updateUser.execute(user.id, {
      email: existing.email,
    })

    expect(result).toEqual(Result.fail({ username: undefined, email: "EMAIL_TAKEN" }))
  })
})
