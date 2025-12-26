import type { RegisterUserRequest } from "~/presentation/auth/dtos/register-user-request.js"
import { faker } from "@faker-js/faker"

type Params = Partial<RegisterUserRequest>

export const RegisterUserRequestMother = {
  create({
    email = faker.internet.email(),
    username = faker.internet.username(),
    password = createValidPassword(),
  }: Params = {}): RegisterUserRequest {
    return {
      email,
      username,
      password,
    }
  },
}

function createValidPassword(): string {
  const lowercase = faker.string.alpha({ length: 1, casing: "lower" })
  const uppercase = faker.string.alpha({ length: 1, casing: "upper" })
  const numbers = faker.string.numeric(1)
  const special = faker.string.fromCharacters("!@#$%&*")
  const extra = faker.string.alphanumeric({ length: { min: 4, max: 8 } })

  const parts = [lowercase, uppercase, numbers, special, extra]
  const shuffled = faker.helpers.shuffle(parts.join("").split(""))

  return shuffled.join("")
}
