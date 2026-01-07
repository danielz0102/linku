import type { UserRepository } from "~/repositories/user-repository.ts"
import type { AuthService } from "~/services/auth-services/auth-service.js"

import jwt from "jsonwebtoken"
import { createFakeUser } from "~/__tests__/lib/user-mother.ts"
import { Result } from "~/lib/Result.ts"
import { AuthModel } from "./auth-model.ts"

const fakeUser = createFakeUser()

const authSerivceMock = vi.mockObject<AuthService>({
  verifyToken: vi.fn(() => Promise.resolve(Result.ok(fakeUser))),
})
const repoMock = vi.mockObject<UserRepository>({
  create: vi.fn(() => Promise.resolve(fakeUser)),
  findByEmail: vi.fn(() => Promise.resolve(fakeUser)),
  findById: vi.fn(),
})

const idToken = "valid-id-token"
const auth = new AuthModel(repoMock, authSerivceMock)

test("returns access and refresh tokens on success", async () => {
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

test("returns an error when authentication fails", async () => {
  authSerivceMock.verifyToken.mockResolvedValueOnce(
    Result.fail(new Error("Invalid token"))
  )

  const result = await auth.auth(idToken)

  expect(result.success).toBe(false)
  expect(result.error?.message).toBe("Token is not valid")
})
