import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { UpdateUserUseCase } from "~/users/application/use-cases/update-user-use-case.ts"

const repo = new UserRepositoryMock()
const service = new UpdateUserUseCase({ userRepo: repo })

const userId = crypto.randomUUID()

type Input = Parameters<UpdateUserUseCase["execute"]>[1]
const input: Input = {
  username: "newusername",
  email: "new@example.com",
  firstName: "New",
  lastName: "Name",
  bio: "Hello!",
}

test("returns the updated public user", async () => {
  const user = UserMother.create({ id: userId })
  repo.search.mockResolvedValueOnce(undefined)
  repo.update.mockResolvedValueOnce(user)

  const { ok, data } = await service.execute(userId, input)

  expect(ok).toBe(true)
  expect(data).toEqual({
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    profilePicUrl: user.profilePicUrl,
  })
})

test("fails if username belongs to another user", async () => {
  repo.search.mockImplementationOnce(async (filters) => {
    if (filters.username) return UserMother.create()
  })

  const { ok } = await service.execute(userId, { username: "taken" })

  expect(ok).toBe(false)
})

test("does not fail if username belongs to the same user", async () => {
  const user = UserMother.create({ id: userId })
  repo.search.mockImplementationOnce(async (filters) => {
    if (filters.username) return user
  })
  repo.update.mockResolvedValueOnce(user)

  const { ok } = await service.execute(userId, { username: user.username })

  expect(ok).toBe(true)
})

test("fails if email belongs to another user", async () => {
  repo.search.mockImplementationOnce(async (filters) => {
    if (filters.email) return UserMother.create()
  })

  const { ok } = await service.execute(userId, {
    email: "taken@example.com",
  })

  expect(ok).toBe(false)
})

test("does not fail if email belongs to the same user", async () => {
  const user = UserMother.create({ id: userId })
  repo.search.mockImplementationOnce(async (filters) => {
    if (filters.email) return user
  })
  repo.update.mockResolvedValueOnce(user)

  const { ok } = await service.execute(userId, { email: user.email })

  expect(ok).toBe(true)
})
