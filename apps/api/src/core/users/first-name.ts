export const FIRST_NAME_MAX_LENGTH = 50

export class FirstName {
  readonly value: string

  constructor(value: string) {
    if (value.length > FIRST_NAME_MAX_LENGTH) {
      throw new Error(`First name must be at most ${FIRST_NAME_MAX_LENGTH} characters`)
    }

    this.value = value
  }
}
