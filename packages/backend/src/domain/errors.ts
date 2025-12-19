function createCustomError(name: string) {
  return class extends Error {
    constructor(message: string, options?: ErrorOptions) {
      super(message, options)
      this.name = name
    }
  }
}

export const InvalidUserError = createCustomError("InvalidUserError")
export const UserRepositoryError = createCustomError("UserRepositoryError")
