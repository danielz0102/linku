export type ErrorBody = {
  code: ErrorCode
  message: string
  errors?: {
    [key in string]: string
  }
}

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "UNEXPECTED_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "TOO_MANY_REQUESTS"
