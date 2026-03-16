import { faker } from "@faker-js/faker"

import { User, type UserParams } from "~/core/users/user.ts"

export const UserMother = {
  create(overrides: Partial<UserParams> = {}): User {
    return new User({
      id: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      hashedPassword: faker.string.alphanumeric(20),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      bio: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      profilePicUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
      ...overrides,
    })
  },
}
