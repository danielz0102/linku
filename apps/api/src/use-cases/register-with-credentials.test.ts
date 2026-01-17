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
  tokenService.signToken.mockResolvedValue(FAKE_TOKEN)
})

afterEach(() => {
  fileService.uploadFile.mockClear()
  repo.create.mockClear()
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

test("uploads profile picture when provided", async () => {
  const PROFILE_PIC_URL = "https://example.com/profile.jpg"
  fileService.uploadFile.mockResolvedValue(PROFILE_PIC_URL)

  const profilePicture = {
    buffer: Buffer.from("fake-image-data"),
    mimetype: "image/jpeg",
    originalname: "profile.jpg",
  }

  const result = await useCase.execute({
    ...user,
    password: "plain-password",
    profilePicture,
  })

  expect(result.success).toBe(true)
  expect(fileService.uploadFile).toHaveBeenCalledWith(profilePicture)
  expect(repo.create).toHaveBeenCalledWith(
    expect.objectContaining({
      profilePicUrl: PROFILE_PIC_URL,
    })
  )
})

test("does not upload profile picture when not provided", async () => {
  const result = await useCase.execute({
    ...user,
    password: "plain-password",
  })

  expect(result.success).toBe(true)
  expect(fileService.uploadFile).not.toHaveBeenCalled()
  expect(repo.create).toHaveBeenCalledWith(
    expect.objectContaining({
      profilePicUrl: undefined,
    })
  )
})
