import { PasswordHasherMock } from "~/__test-utils__/mocks/password-hasher-mock.ts"
import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import {
  RegistrationUseCase,
  type RegistrationData,
} from "~/users/application/use-cases/registration-use-case.ts"
import { faker } from "@faker-js/faker"

const repo = new UserRepositoryMock()
const register = new RegistrationUseCase({
  userRepo: repo,
  hasher: new PasswordHasherMock(),
})

test("returns a public user", async () => {
  const userCreated = UserMother.create()
  repo.create.mockResolvedValue(userCreated)

  const { ok, data } = await register.execute(createDto())

  expect(ok).toBe(true)

  const { hashedPassword: _, ...publicUser } = userCreated

  expect(data).toEqual(publicUser)
})

test("fails if there is a user with the same username", async () => {
  const dto = createDto()
  repo.findOne.mockResolvedValueOnce(
    UserMother.create({ username: dto.username })
  )

  const { ok, error } = await register.execute(dto)

  expect(ok).toBe(false)
  expect(error).toEqual({ username: "Username already exists" })
})

test("fails if there is a user with the same email", async () => {
  const dto = createDto()
  repo.findOne.mockResolvedValueOnce(UserMother.create({ email: dto.email }))

  const { ok, error } = await register.execute(dto)

  expect(ok).toBe(false)
  expect(error).toEqual({ email: "Email already exists" })
})

function createDto(overrides?: Partial<RegistrationData>): RegistrationData {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    ...overrides,
  }
}
