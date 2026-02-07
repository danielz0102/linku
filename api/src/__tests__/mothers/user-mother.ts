import type { User } from "#users/types.d.js"
import { faker } from "@faker-js/faker"

export const UserMother = {
  create(overrides: Partial<User> = {}): User {
    return {
      id: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      hashedPassword: faker.string.alphanumeric(20),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      bio: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      profilePicUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
      ...overrides,
    }
  },
}
