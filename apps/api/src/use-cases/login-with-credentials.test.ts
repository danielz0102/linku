import type { UserRecord } from "#db/drizzle/schemas.js"
import { PasswordHasher } from "#ports/password-hasher.js"
import { TokenService } from "#ports/token-service.js"
import type { UserRepository } from "#ports/user-repository.d.js"
import { faker } from "@faker-js/faker"
import { LoginWithCredentials } from "./login-with-credentials.js"

const fakeUser: UserRecord = {
  id: faker.string.uuid(),
  username: faker.internet.username(),
  email: faker.internet.email(),
  hashedPassword: faker.string.alphanumeric(10),
  bio: faker.lorem.text(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  profilePicId: null,
  signUpAt: faker.date.past(),
  status: "offline",
}

const repo = {
  findBy: vi.fn<UserRepository["findBy"]>(() => Promise.resolve(fakeUser)),
} satisfies UserRepository

const HasherMock = vi.fn(
  class extends PasswordHasher {
    override hash = vi.fn()
    override compare = vi.fn(() => Promise.resolve(true))
  }
)
const hasher = new HasherMock(1)

const TokenServiceMock = vi.fn(
  class extends TokenService {
    override accessToken = vi.fn(() => Promise.resolve("valid.token.here"))
  }
)
const tokenService = new TokenServiceMock("secret")

const useCase = new LoginWithCredentials({
  repo,
  hasher,
  tokenService,
})

test("returns a token when credentials are valid", async () => {
  const result = await useCase.execute({
    username: fakeUser.username,
    password: "plainPassword",
  })

  expect(result.success).toBe(true)
  expect(result.data).toEqual({ accessToken: "valid.token.here" })
})

test("returns an error when user is not found", async () => {
  repo.findBy.mockResolvedValueOnce(undefined)

  const result = await useCase.execute({
    username: "nonexistentuser",
    password: "plainPassword",
  })

  expect(result.success).toBe(false)
  expect(result.error).toEqual(new Error("Invalid credentials"))
})

test("returns an error when password is invalid", async () => {
  hasher.compare.mockResolvedValueOnce(false)

  const result = await useCase.execute({
    username: fakeUser.username,
    password: "wrongPassword",
  })

  expect(result.success).toBe(false)
  expect(result.error).toEqual(new Error("Invalid credentials"))
})
