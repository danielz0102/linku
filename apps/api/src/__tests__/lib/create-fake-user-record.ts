import { faker } from "@faker-js/faker"

export const createFakeUser = (overrides: Partial<User> = {}): User => ({
  ...createDefaultUser(),
  ...overrides,
})

const createDefaultUser = (): User => ({
  id: faker.string.uuid(),
  username: faker.internet.username(),
  email: faker.internet.email(),
  hashedPassword: faker.string.alphanumeric(16),
  bio: faker.lorem.text(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  profilePicUrl: faker.helpers.maybe(() => faker.image.avatar()),
  signUpAt: faker.date.recent(),
  status: faker.helpers.arrayElement<User["status"]>(["online", "offline"]),
})
