type SuccessResult<T> = {
  success: true
  data: T
}

type FailureResult = {
  success: false
  error: Error
}

export type Result<T> = SuccessResult<T> | FailureResult

export const Result = {
  ok<U>(data: U): Result<U> {
    return { success: true, data }
  },

  fail<U>(error: Error): Result<U> {
    return { success: false, error }
  },
}
