import type { Password } from "~/domain/value-objects/password.js"

export interface RegisterUserInput {
  email: string
  username: string
  password: Password
}
