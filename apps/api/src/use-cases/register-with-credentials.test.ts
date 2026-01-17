import { createFakeUser } from "#__tests__/lib/create-fake-user-record.js"
import { createFileServiceMock } from "#__tests__/lib/file-service-mock.js"
import { createHasherMock } from "#__tests__/lib/hasher-mock.js"
import { createTokenServiceMock } from "#__tests__/lib/token-service-mock.js"
import { createUserRepositoryMock } from "#__tests__/lib/user-repository-mock.js"
import { toPublicUser } from "#domain/entities/user-mapper.js"
import { RegisterWithCredentials } from "./register-with-credentials.js"

const FAKE_TOKEN = "valid.token.here"
const user = createFakeUser()
const repo = createUserRepositoryMock()
const tokenService = createTokenServiceMock()
const fileService = createFileServiceMock()
const useCase = new RegisterWithCredentials({
  repo,
  hasher: createHasherMock(),
  tokenService,
  fileService,
})

beforeAll(() => {
  repo.findBy.mockResolvedValue(undefined)
  repo.create.mockResolvedValue(user)
  tokenService.signAuthTokens.mockResolvedValue({
    accessToken: FAKE_TOKEN,
    refreshToken: FAKE_TOKEN,
  })
})

test("returns public user with tokens on success", async () => {
  const result = await useCase.execute({
    ...user,
    password: "plain-password",
  })

  expect(result.success).toBe(true)
  expect(result.data).toMatchObject({
    user: toPublicUser(user),
    accessToken: FAKE_TOKEN,
    refreshToken: FAKE_TOKEN,
  })
  expect(result.data).not.toHaveProperty("hashedPassword")
})

test("returns an error if user already exists", async () => {
  repo.findBy.mockResolvedValueOnce(user)

  const result = await useCase.execute({
    ...user,
    password: "plain-password",
  })

  expect(result.success).toBe(false)
  expect(result.error).toEqual(new Error("User already exists"))
})
