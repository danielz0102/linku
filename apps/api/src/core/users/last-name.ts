export class LastName {
  static readonly MAX_LENGTH = 50
  readonly value: string

  constructor(value: string) {
    const trimmed = value.trim()

    if (trimmed.length > LastName.MAX_LENGTH) {
      throw new Error(`Last name must be at most ${LastName.MAX_LENGTH} characters`)
    }

    this.value = trimmed
  }
}
