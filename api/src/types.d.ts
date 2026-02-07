export type ErrorBody = {
  message: string
  errors: {
    field: string
    details: string
  }[]
}
