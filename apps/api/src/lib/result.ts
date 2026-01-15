type Success<T> = {
  success: true
  error?: never
  data: T
}

type Failure = {
  success: false
  error: Error
  data?: never
}

export type Result<T> = Success<T> | Failure

export const Result = {
  ok<U>(data: U): Result<U> {
    return { success: true, data }
  },

  fail<U>(error: Error): Result<U> {
    return { success: false, error }
  },
}
