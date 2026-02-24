export type ErrorBody<T extends string = string> = {
  code: ErrorCode
  message: string
  errors?: {
    [key in T]: string
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
