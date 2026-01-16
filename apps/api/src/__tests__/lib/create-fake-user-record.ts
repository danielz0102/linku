import type { UserRecord } from "#db/drizzle/schemas.js"
import { faker } from "@faker-js/faker"

export const createFakeUserRecord = (
  overrides: Partial<UserRecord> = {}
): UserRecord => ({
  ...createDefaultRecord(),
  ...overrides,
})

const createDefaultRecord = (): UserRecord => ({
  id: faker.string.uuid(),
  username: faker.internet.username(),
  email: faker.internet.email(),
  hashedPassword: faker.string.alphanumeric(16),
  bio: faker.lorem.text(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  profilePicId:
    faker.helpers.maybe(() => faker.string.uuid(), {
      probability: 0.5,
    }) || null,
  signUpAt: faker.date.recent(),
  status: faker.helpers.arrayElement<UserRecord["status"]>([
    "online",
    "offline",
  ]),
})
