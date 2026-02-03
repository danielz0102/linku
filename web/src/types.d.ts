export type User = {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  pictureUrl: string | null
}

export type ValidationErrorData = {
  errors: {
    [key: string]: string[]
  }
}
