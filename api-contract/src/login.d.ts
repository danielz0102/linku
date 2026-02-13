import type { ErrorBody } from "./error.js"

export type LoginBody = {
  username: string
  password: string
}

export type LoginErrorBody = ErrorBody<keyof LoginBody>
