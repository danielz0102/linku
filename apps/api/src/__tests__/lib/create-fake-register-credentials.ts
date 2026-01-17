import type { RegisterCredentials } from "#domain/entities/user.d.js"
import { faker } from "@faker-js/faker"

export const createFakeRegisterCredentials = (
  overrides: Partial<RegisterCredentials> = {}
): RegisterCredentials => ({
  ...createDefaultCredentials(),
  ...overrides,
})

const createDefaultCredentials = (): RegisterCredentials => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: createValidPassword(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  profilePicUrl: faker.helpers.maybe(() => faker.image.avatar()),
})

const createValidPassword = (): string => {
  const lowercase = faker.string.alpha({ length: 2, casing: "lower" })
  const uppercase = faker.string.alpha({ length: 2, casing: "upper" })
  const digit = faker.string.numeric(2)
  const special = faker.helpers.arrayElement([
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
  ])
  const extra = faker.string.alphanumeric({ length: 2 })

  return faker.helpers
    .shuffle([lowercase, uppercase, digit, special, extra])
    .join("")
}
