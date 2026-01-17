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
  password: faker.internet.password({ length: 12 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  profilePicUrl: faker.helpers.maybe(() => faker.image.avatar()),
})
