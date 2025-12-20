import type { UserRepository } from "~/domain/repositories/user-repository"
import type { RegisterUserInput } from "../dtos/register-user-input"
import type { PasswordHasher } from "../ports/password-hasher"

import User from "~/domain/entities/user"
import { RegisterUser } from "./register-user"
import { Password } from "~/domain/value-objects/password"
import { Email } from "~/domain/value-objects/email"

const dto: RegisterUserInput = {
  email: new Email("example@example.com"),
  username: "john_doe",
  password: new Password("SecureP@ssw0rd"),
}

const user = new User({
  id: "user-id",
  email: dto.email,
  username: dto.username,
  passwordHash: "hashedpassword",
})

const repo = vi.mockObject<UserRepository>({
  register: vi.fn(() => Promise.resolve(user)),
  exists: vi.fn(() => Promise.resolve(false)),
})

const hasher = vi.mockObject<PasswordHasher>({
  hash: vi.fn(),
  compare: vi.fn(),
})

const useCase = new RegisterUser(repo, hasher)

test("returns a User on success", async () => {
  const result = await useCase.execute(dto)
  expect(result.success).toBe(true)
  expect(result.data).toEqual(user)
})

test("hashes the password before registering", async () => {
  const passwordHash = "$super%#$%$hashed"
  hasher.hash.mockResolvedValueOnce(passwordHash)

  await useCase.execute(dto)

  expect(hasher.hash).toHaveBeenCalledWith(dto.password.value)
  expect(repo.register).toHaveBeenCalledWith({
    ...dto,
    email: dto.email.value,
    passwordHash,
  })
})

test("fails if user already exists", async () => {
  repo.exists.mockResolvedValueOnce(true)
  const result = await useCase.execute(dto)
  expect(result.success).toBe(false)
})
