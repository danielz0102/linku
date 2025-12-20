import type { RegisterUserInput } from "~/application/dtos/register-user-input.js"
import { Password } from "~/domain/value-objects/password.js"

export interface RegisterUserRequest {
  email: string
  username: string
  password: string
}

export const RegisterUserRequestMapper = {
  toInput(request: RegisterUserRequest): RegisterUserInput {
    return {
      email: request.email,
      username: request.username,
      password: new Password(request.password),
    }
  },
}
