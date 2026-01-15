import { createFakeUserRecord } from "#__tests__/lib/create-fake-user-record.js"
import { createHasherMock } from "#__tests__/lib/hasher-mock.js"
import { createUserRepositoryMock } from "#__tests__/lib/user-repository-mock.js"
import { createTokenServiceMock } from "../__tests__/lib/token-service-mock.js"
import { LoginWithCredentials } from "./login-with-credentials.js"

const repo = createUserRepositoryMock()
const hasher = createHasherMock()
const tokenService = createTokenServiceMock()
const useCase = new LoginWithCredentials({
  repo,
  hasher,
  tokenService,
})

beforeAll(() => {
  repo.findBy.mockResolvedValue(createFakeUserRecord())
  hasher.compare.mockResolvedValue(true)
  tokenService.accessToken.mockReturnValue("valid.token.here")
})

test("returns a token when credentials are valid", async () => {
  const result = await useCase.execute({
    username: "john.doe",
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
    username: "john.doe",
    password: "wrongPassword",
  })

  expect(result.success).toBe(false)
  expect(result.error).toEqual(new Error("Invalid credentials"))
})
