import type { LinkuAPI } from "@linku/api-contract"

type ApiErrorParams = {
  code: LinkuAPI.ErrorCode
  errors?: LinkuAPI.ErrorBody["errors"]
}

export class ApiError {
  readonly code: LinkuAPI.ErrorCode
  private validationErrors?: LinkuAPI.ErrorBody["errors"]

  constructor({ code, errors }: ApiErrorParams) {
    this.code = code
    this.validationErrors = errors
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof this
  }

  get genericMessage(): string {
    return GenericErrorMessage[this.code]
  }

  getValidationError(field: string): string | undefined {
    return this.validationErrors?.[field]
  }
}

const GenericErrorMessage: Record<LinkuAPI.ErrorCode, string> = {
  VALIDATION_ERROR:
    "There was a validation error. Please check the provided data and try again.",
  NETWORK_ERROR:
    "A network error occurred. Please check your connection and try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again later.",
  NOT_FOUND: "The requested resource was not found.",
  FORBIDDEN: "You do not have permission to perform this action.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  TOO_MANY_REQUESTS: "Too many attempts. Try again later.",
} as const
