import { PasswordHasherMock } from "~/__test-utils__/mocks/password-hasher-mock.ts"
import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import {
  LoginUseCase,
  type LoginCredentials,
} from "~/users/application/use-cases/login-use-case.ts"
import { faker } from "@faker-js/faker"

const repo = new UserRepositoryMock()
const hasher = new PasswordHasherMock()
const useCase = new LoginUseCase({
  userRepo: repo,
  hasher,
})

test("returns a public user if credentials are valid", async () => {
  const user = UserMother.create()
  repo.findOne.mockResolvedValueOnce(user)
  hasher.compare.mockResolvedValueOnce(true)

  const { ok, data } = await useCase.execute(createDTO())

  expect(ok).toBe(true)
  expect(data).toEqual(user.toPublic())
})

test("fails if user does not exist", async () => {
  repo.findOne.mockResolvedValueOnce(undefined)

  const { ok } = await useCase.execute(createDTO())

  expect(ok).toBe(false)
})

test("fails if password is invalid", async () => {
  repo.findOne.mockResolvedValueOnce(UserMother.create())
  hasher.compare.mockResolvedValueOnce(false)

  const { ok } = await useCase.execute(createDTO())

  expect(ok).toBe(false)
})

function createDTO(overrides?: Partial<LoginCredentials>): LoginCredentials {
  return {
    username: faker.internet.username(),
    password: faker.internet.password(),
    ...overrides,
  }
}
