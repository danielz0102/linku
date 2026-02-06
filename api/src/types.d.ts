export type ValidationErrorBody = {
  message: "Validation failed"
  errors: ErrorField[]
}

type ErrorField = {
  field: string
  details: string
}
