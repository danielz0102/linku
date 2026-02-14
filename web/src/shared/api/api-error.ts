import type { ErrorCode, ErrorBody } from "api-contract"

export class ApiError {
  readonly code: ErrorCode
  private validationErrors?: ErrorBody["errors"]

  constructor({ code, errors }: ApiErrorParams) {
    this.code = code
    this.validationErrors = errors
  }

  get genericMessage(): string {
    return ERROR_MESSAGES[this.code]
  }

  getValidationError(field: string): string | undefined {
    return this.validationErrors?.[field]
  }
}

type ApiErrorParams = {
  code: ErrorCode
  errors?: ErrorBody["errors"]
}

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_ERROR:
    "There was a validation error. Please check the provided data and try again.",
  NETWORK_ERROR:
    "A network error occurred. Please check your connection and try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again later.",
  NOT_FOUND: "The requested resource was not found.",
  FORBIDDEN: "You do not have permission to perform this action.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  TOO_MANY_REQUESTS: "Too many attempts. Try again later.",
}
