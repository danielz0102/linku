import type { ErrorCode } from "api-contract"

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_ERROR:
    "There was a validation error. Please check the provided data and try again.",
  NETWORK_ERROR:
    "A network error occurred. Please check your connection and try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again later.",
  NOT_FOUND: "The requested resource was not found.",
  FORBIDDEN: "You do not have permission to perform this action.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  TOO_MANY_REQUESTS: "Too many requests. Please slow down and try again later.",
}

export function errorMatcher(code: ErrorCode): string {
  return ERROR_MESSAGES[code]
}
