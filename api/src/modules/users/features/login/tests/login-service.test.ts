import { PasswordHasherMock } from "#__test-utils__/mocks/password-hasher-mock.js"
import { UserRepositoryMock } from "#__test-utils__/mocks/user-repository-mock.js"
import { UserMother } from "#__test-utils__/mothers/user-mother.js"
import { LoginService } from "../login-service.js"

const repo = new UserRepositoryMock()
const hasher = new PasswordHasherMock()
const service = new LoginService({
  userRepo: repo,
  hasher,
})

type Input = Parameters<LoginService["login"]>[0]

const input: Input = {
  username: "testuser",
  password: "password123",
}

test("returns a public user if credentials are valid", async () => {
  const user = UserMother.create()
  repo.search.mockResolvedValueOnce(user)
  hasher.compare.mockResolvedValueOnce(true)

  const { ok, data } = await service.login(input)

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

test("fails if user does not exist", async () => {
  repo.search.mockResolvedValueOnce(undefined)

  const { ok, error } = await service.login(input)

  expect(ok).toBe(false)
  expect(error).toBe("invalidCredentials")
})

test("fails if password is invalid", async () => {
  repo.search.mockResolvedValueOnce(UserMother.create())
  hasher.compare.mockResolvedValueOnce(false)

  const { ok, error } = await service.login(input)

  expect(ok).toBe(false)
  expect(error).toBe("invalidCredentials")
})
