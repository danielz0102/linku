import type { User } from "~/db/drizzle/schema.js"
import { faker } from "@faker-js/faker"

export function createFakeUser(partial: Partial<User> = {}): User {
  return {
    id: partial.id ?? faker.string.uuid(),
    email: partial.email ?? faker.internet.email(),
    firstName: partial.firstName ?? faker.person.firstName(),
    lastName: partial.lastName ?? faker.person.lastName(),
    picture: partial.picture ?? faker.image.avatar(),
  }
}
