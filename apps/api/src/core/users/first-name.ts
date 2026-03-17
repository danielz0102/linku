export class FirstName {
  static readonly MAX_LENGTH = 50
  readonly value: string

  constructor(value: string) {
    const trimmed = value.trim()

    if (trimmed.length > FirstName.MAX_LENGTH) {
      throw new Error(`First name must be at most ${FirstName.MAX_LENGTH} characters`)
    }

    this.value = trimmed
  }
}
