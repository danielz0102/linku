import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { UpdateUserUseCase } from "~/users/application/use-cases/update-user-use-case.ts"

const repo = new UserRepositoryMock()
const service = new UpdateUserUseCase({ userRepo: repo })

beforeEach(() => {
  repo.search.mockResolvedValue(undefined)
})

test("returns the updated public user", async () => {
  const userUpdated = UserMother.create()
  repo.update.mockResolvedValueOnce(userUpdated)

  const { ok, data } = await service.execute(crypto.randomUUID(), {
    username: "newUsername",
  })

  expect(ok).toBe(true)
  expect(data).toEqual({
    id: userUpdated.id,
    username: userUpdated.username,
    email: userUpdated.email,
    firstName: userUpdated.firstName,
    lastName: userUpdated.lastName,
    bio: userUpdated.bio,
    profilePicUrl: userUpdated.profilePicUrl,
  })
})

test("fails if username or email belongs to another user", async () => {
  repo.search.mockResolvedValueOnce(UserMother.create())

  const { ok } = await service.execute(crypto.randomUUID(), {
    username: "taken",
  })

  expect(ok).toBe(false)
})
