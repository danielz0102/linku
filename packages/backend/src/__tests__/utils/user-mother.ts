import User from "~/domain/entities/user.js"
import { faker } from "@faker-js/faker"

type UserMotherParams = Partial<ConstructorParameters<typeof User>[0]>

export const UserMother = {
  create({
    id = faker.string.uuid(),
    username = faker.internet.username(),
    email = faker.internet.email(),
    passwordHash = faker.string.alphanumeric(16),
    profilePicUrl,
    status = faker.helpers.arrayElement(["online", "offline"]),
  }: UserMotherParams = {}): User {
    return new User({
      id,
      username,
      email,
      passwordHash,
      profilePicUrl,
      status,
    })
  },
}
