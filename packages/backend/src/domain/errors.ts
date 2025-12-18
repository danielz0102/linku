function createCustomError(name: string) {
  return class extends Error {
    constructor(message: string) {
      super(message)
      this.name = name
    }
  }
}

export const InvalidUserError = createCustomError("InvalidUserError")
