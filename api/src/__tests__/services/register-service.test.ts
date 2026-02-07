import { UserRepositoryMock } from "#__tests__/mocks/user-repository-mock.js"
import { UserMother } from "#__tests__/mothers/user-mother.js"
import { RegisterService } from "#users/register/register-service.js"

const repo = new UserRepositoryMock()
const service = new RegisterService({
  userRepo: repo,
  hashPassword: vi.fn(),
})

type Input = Parameters<RegisterService["register"]>[0]

const input: Input = {
  username: "testuser",
  email: "testuser@example.com",
  firstName: "Test",
  lastName: "User",
  password: "password123",
}

test("returns a public user", async () => {
  const user = UserMother.create()
  repo.create.mockResolvedValue(user)

  const { ok, data } = await service.register(input)

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

test("fails if username already exists", async () => {
  repo.search.mockImplementation(async (filters) => {
    if (filters.username) return UserMother.create()
  })

  const { ok, error } = await service.register(input)

  expect(ok).toBe(false)
  expect(error?.usernameExists).toBe(true)
})

test("fails if email already exists", async () => {
  repo.search.mockImplementation(async (filters) => {
    if (filters.email) return UserMother.create()
  })

  const { ok, error } = await service.register(input)

  expect(ok).toBe(false)
  expect(error?.emailExists).toBe(true)
})
