import type { ErrorBody } from "./error.js"

export type LoginBody = {
  email: string
  password: string
}

export type LoginErrorBody = ErrorBody<keyof LoginBody>
