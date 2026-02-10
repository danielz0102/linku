import type { ErrorBody } from "./error.js"

export type RegistrationBody = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export type RegistrationErrorBody = ErrorBody<keyof RegistrationBody>
