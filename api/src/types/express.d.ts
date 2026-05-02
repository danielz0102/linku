import "express"

declare global {
  namespace Express {
    interface Response {
      sendValidationError(details: unknown): this
    }
  }
}
