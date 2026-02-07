import type { UserRepository } from "#users/interfaces/user-repository.d.js"
import { RegisterService } from "#users/register/register-service.js"
import type { User } from "#users/types.d.js"

const userRepoMock = vi.mockObject<UserRepository>({
  create: vi.fn(),
  search: vi.fn(),
})

const user: User = {
  id: "23",
  username: "testuser",
  email: "testuser@example.com",
  hashedPassword: "hashedpassword",
  firstName: "Test",
  lastName: "User",
  bio: null,
  profilePicUrl: null,
}

const service = new RegisterService({
  userRepo: userRepoMock,
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

beforeAll(() => {
  userRepoMock.create.mockResolvedValue(user)
})

test("fails if username already exists", async () => {
  userRepoMock.search.mockImplementation(async (filters) => {
    if (filters.username) return user
  })

  const { ok, error } = await service.register(input)

  expect(ok).toBe(false)
  expect(error?.usernameExists).toBe(true)
})

test("fails if email already exists", async () => {
  userRepoMock.search.mockImplementation(async (filters) => {
    if (filters.email) return user
  })

  const { ok, error } = await service.register(input)

  expect(ok).toBe(false)
  expect(error?.emailExists).toBe(true)
})
