import { PasswordHasherMock } from "~/__test-utils__/mocks/password-hasher-mock.ts"
import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { RegistrationUseCase } from "~/users/application/use-cases/registration-use-case.ts"

const repo = new UserRepositoryMock()
const service = new RegistrationUseCase({
  userRepo: repo,
  hasher: new PasswordHasherMock(),
})

type Input = Parameters<RegistrationUseCase["execute"]>[0]

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

  const { ok, data } = await service.execute(input)

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

  const { ok } = await service.execute(input)

  expect(ok).toBe(false)
})

test("fails if email already exists", async () => {
  repo.search.mockImplementation(async (filters) => {
    if (filters.email) return UserMother.create()
  })

  const { ok } = await service.execute(input)

  expect(ok).toBe(false)
})
