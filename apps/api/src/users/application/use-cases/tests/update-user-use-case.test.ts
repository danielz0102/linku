import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { UpdateUserUseCase } from "~/users/application/use-cases/update-user-use-case.ts"

const repo = new UserRepositoryMock()
const service = new UpdateUserUseCase({ userRepo: repo })

test("returns the updated public user", async () => {
  const userUpdated = UserMother.create()
  repo.update.mockResolvedValueOnce(userUpdated)

  const { ok, data } = await service.execute(crypto.randomUUID(), {
    username: "newUsername",
  })

  expect(ok).toBe(true)

  const { hashedPassword: _, ...publicUser } = userUpdated

  expect(data).toEqual(publicUser)
})

test("fails if username belongs to another user", async () => {
  repo.search.mockResolvedValueOnce(UserMother.create({ username: "taken" }))

  const { ok, error } = await service.execute(crypto.randomUUID(), {
    username: "taken",
  })

  expect(ok).toBe(false)
  expect(error).toEqual({ username: "Username already exists" })
})

test("fails if email belongs to another user", async () => {
  repo.search.mockResolvedValueOnce(UserMother.create({ email: "taken" }))

  const { ok, error } = await service.execute(crypto.randomUUID(), {
    email: "taken",
  })

  expect(ok).toBe(false)
  expect(error).toEqual({ email: "Email already exists" })
})
