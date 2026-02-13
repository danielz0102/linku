import type { ErrorBody } from "./error.js"

export type LoginQuery = {
  email: string
  password: string
}

export type LoginErrorBody = ErrorBody<keyof LoginQuery>
