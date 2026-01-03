import type { User } from "~/db/drizzle/schema.ts"
import type { UserRepository } from "~/repositories/user-repository.ts"
import type { AuthService } from "~/services/auth-services/auth-service.js"

import { faker } from "@faker-js/faker"
import jwt from "jsonwebtoken"
import { Result } from "~/lib/Result.ts"
import { authenticate } from "./authenticate.ts"

const fakeUser: User = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  picture: faker.image.avatar(),
}

const authSerivceMock = vi.mockObject<AuthService>({
  verifyToken: vi.fn(() => Promise.resolve(Result.ok(fakeUser))),
})
const repoMock = vi.mockObject<UserRepository>({
  create: vi.fn(() => Promise.resolve(fakeUser)),
  findByEmail: vi.fn(() => Promise.resolve(fakeUser)),
})

const params = {
  idToken: "valid-id-token",
  repo: repoMock,
  authService: authSerivceMock,
}

test("returns a JWT token with user data on successful authentication", async () => {
  const result = await authenticate(params)

  expect(result.success).toBe(true)

  const decoded = jwt.decode(result.data!)
  expect(decoded).toMatchObject(fakeUser)
})

test("returns an error when authentication fails", async () => {
  authSerivceMock.verifyToken.mockResolvedValueOnce(
    Result.fail(new Error("Invalid token"))
  )

  const result = await authenticate(params)

  expect(result.success).toBe(false)
  expect(result.error?.message).toBe("Token is not valid")
})
