import type { ErrorBody } from "./error.js"

export type UpdateUserBody = {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  bio?: string
}

export type UpdateUserErrorBody = ErrorBody<keyof UpdateUserBody>
