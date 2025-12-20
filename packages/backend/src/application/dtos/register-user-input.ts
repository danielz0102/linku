import type { Email } from "~/domain/value-objects/email.js"
import type { Password } from "~/domain/value-objects/password.js"

export interface RegisterUserInput {
  username: string
  email: Email
  password: Password
}
