export const LAST_NAME_MAX_LENGTH = 50

export class LastName {
  readonly value: string

  constructor(value: string) {
    const trimmed = value.trim()

    if (trimmed.length > LAST_NAME_MAX_LENGTH) {
      throw new Error(`Last name must be at most ${LAST_NAME_MAX_LENGTH} characters`)
    }

    this.value = trimmed
  }
}
