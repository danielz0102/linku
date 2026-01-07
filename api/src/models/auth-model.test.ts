import type { UserRepository } from "~/repositories/user-repository.ts"
import type { AuthService } from "~/services/auth-services/auth-service.js"

import jwt from "jsonwebtoken"
import { createFakeUser } from "~/__tests__/lib/user-mother.ts"
import { JWT_SECRET } from "~/config/env.ts"
import { Result } from "~/lib/Result.ts"
import { AuthModel } from "./auth-model.ts"

const fakeUser = createFakeUser()

const authSerivceMock = vi.mockObject<AuthService>({
  verifyToken: vi.fn(() => Promise.resolve(Result.ok(fakeUser))),
})
const repoMock = vi.mockObject<UserRepository>({
  create: vi.fn(() => Promise.resolve(fakeUser)),
  findByEmail: vi.fn(() => Promise.resolve(fakeUser)),
  findById: vi.fn(() => Promise.resolve(fakeUser)),
})

const idToken = "valid-id-token"
const auth = new AuthModel(repoMock, authSerivceMock)

describe("auth", () => {
  it("returns access and refresh tokens on success", async () => {
    const result = await auth.auth(idToken)

    expect(result.success).toBe(true)

    if (!result.success) {
      throw new Error("Expected authentication to succeed")
    }

    const { accessToken, refreshToken } = result.data
    const atDecoded = jwt.decode(accessToken)
    const rtDecoded = jwt.decode(refreshToken)

    expect(atDecoded).toMatchObject(fakeUser)
    expect(rtDecoded).toMatchObject({ userId: fakeUser.id })
  })

  it("returns an error when authentication fails", async () => {
    authSerivceMock.verifyToken.mockResolvedValueOnce(
      Result.fail(new Error("Invalid token"))
    )

    const result = await auth.auth(idToken)

    expect(result.success).toBe(false)
    expect(result.error?.message).toBe("Token is not valid")
  })
})

describe("generateAccessToken", () => {
  it("generates a new access token from a valid refresh token", async () => {
    const refreshToken = createFakeRefreshToken()

    const accessToken = await auth.generateAccessToken(refreshToken)
    const decoded = jwt.decode(accessToken)

    expect(decoded).toMatchObject(fakeUser)
  })

  it("throws an error if secret is invalid", async () => {
    const invalidRefreshToken = createFakeRefreshToken({
      secret: "invalid-secret",
    })

    await expect(
      auth.generateAccessToken(invalidRefreshToken)
    ).rejects.toThrow()
  })

  it("throws an error if user is not found for the provided refresh token", async () => {
    repoMock.findById.mockResolvedValueOnce(null)
    const refreshToken = createFakeRefreshToken()

    await expect(auth.generateAccessToken(refreshToken)).rejects.toThrow()
  })
})

function createFakeRefreshToken({
  payload = { userId: fakeUser.id },
  secret = JWT_SECRET,
}: Partial<{ payload: object; secret: jwt.Secret }> = {}) {
  return jwt.sign(payload, secret)
}
