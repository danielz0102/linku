import type { LinkuAPI } from "@linku/api-contract"

import { faker } from "@faker-js/faker"
import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { User } from "~/core/users/user.ts"

export const UserMother = {
  create(overrides: Partial<User> = {}): User {
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
  createPublicUser(overrides: Partial<LinkuAPI.User> = {}): LinkuAPI.User {
    return toPublicUser(this.create(overrides))
  },
}
