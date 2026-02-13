export function createCustomError(name: string) {
  return class extends Error {
    constructor(message: string, options?: ErrorOptions) {
      super(message, options)
      this.name = name
    }
  }
}
