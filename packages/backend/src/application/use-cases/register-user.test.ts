import type { RegisterUserInput } from "../dtos/register-user-input"

import { mockHasher } from "~/__tests__/mocks/password-hasher"
import { mockUserRepo } from "~/__tests__/mocks/user-repository"
import User from "~/domain/entities/user"
import { Email } from "~/domain/value-objects/email"
import { Password } from "~/domain/value-objects/password"
import { RegisterUser } from "./register-user"

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

mockUserRepo.register.mockResolvedValue(user)
const useCase = new RegisterUser(mockUserRepo, mockHasher)

test("returns a User on success", async () => {
  const result = await useCase.execute(dto)
  expect(result.success).toBe(true)
  expect(result.data).toEqual(user)
})

test("hashes the password before registering", async () => {
  const passwordHash = "$super%#$%$hashed"
  mockHasher.hash.mockResolvedValueOnce(passwordHash)

  await useCase.execute(dto)

  expect(mockHasher.hash).toHaveBeenCalledWith(dto.password.value)
  expect(mockUserRepo.register).toHaveBeenCalledWith({
    ...dto,
    email: dto.email.value,
    passwordHash,
  })
})

test("fails if user already exists", async () => {
  mockUserRepo.exists.mockResolvedValueOnce(true)
  const result = await useCase.execute(dto)
  expect(result.success).toBe(false)
})
