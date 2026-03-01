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

const newUser: Input = {
  username: "testuser",
  email: "testuser@example.com",
  firstName: "Test",
  lastName: "User",
  password: "password123",
}

beforeEach(() => {
  repo.search.mockResolvedValue(undefined)
})

test("returns a public user", async () => {
  const userCreated = UserMother.create()
  repo.create.mockResolvedValue(userCreated)

  const { ok, data } = await service.execute(newUser)

  expect(ok).toBe(true)
  expect(data).toEqual({
    id: userCreated.id,
    username: userCreated.username,
    email: userCreated.email,
    firstName: userCreated.firstName,
    lastName: userCreated.lastName,
    bio: userCreated.bio,
    profilePicUrl: userCreated.profilePicUrl,
  })
})

test("fails if user already exists", async () => {
  repo.search.mockResolvedValueOnce(UserMother.create())

  const { ok } = await service.execute(newUser)

  expect(ok).toBe(false)
})
