import { faker } from "@faker-js/faker"

import { Result } from "~/core/result.ts"
import { Register, type RegistrationData } from "~/core/use-cases/register-use-case.ts"
import { PasswordHasherMock } from "~tests/helpers/adapters/password-hasher-mock.ts"
import { InMemoryUserRepository } from "~tests/helpers/users/in-memory-user-repository.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

const createDTO = (): RegistrationData => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})

describe("RegistrationUseCase", () => {
  let users: InMemoryUserRepository
  let hasher: PasswordHasherMock
  let register: Register

  beforeEach(() => {
    users = new InMemoryUserRepository()
    hasher = new PasswordHasherMock()
    register = new Register({ userRepo: users, hasher })
  })

  it("returns a public user", async () => {
    const data = createDTO()
    hasher.hash.mockResolvedValue(faker.string.alphanumeric(20))

    const result = await register.execute(data)

    expect(result).toMatchObject(
      Result.ok({
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      })
    )
  })

  it("fails if username already exists", async () => {
    const existing = UserMother.create()
    await users.save(existing)

    const result = await register.execute({
      ...createDTO(),
      username: existing.username,
    })

    expect(result).toEqual(Result.fail({ username: "USERNAME_TAKEN" }))
  })

  it("fails if email already exists", async () => {
    const existing = UserMother.create()
    await users.save(existing)

    const result = await register.execute({
      ...createDTO(),
      email: existing.email,
    })

    expect(result).toEqual(Result.fail({ email: "EMAIL_TAKEN" }))
  })
})
