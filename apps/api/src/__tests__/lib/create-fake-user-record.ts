import type { UserRecord } from "#db/drizzle/schemas.js"
import { faker } from "@faker-js/faker"

export function createFakeUserRecord({
  id = faker.string.uuid(),
  username = faker.internet.username(),
  email = faker.internet.email(),
  hashedPassword = faker.string.alphanumeric(16),
  bio = faker.lorem.text(),
  firstName = faker.person.firstName(),
  lastName = faker.person.lastName(),
  profilePicId = faker.helpers.maybe(() => faker.string.uuid(), {
    probability: 0.5,
  }) || null,
  signUpAt = faker.date.recent(),
  status = faker.helpers.arrayElement<UserRecord["status"]>([
    "online",
    "offline",
  ]),
}: Partial<UserRecord> = {}): UserRecord {
  return {
    id,
    username,
    email,
    hashedPassword,
    bio,
    firstName,
    lastName,
    profilePicId,
    signUpAt,
    status,
  }
}
