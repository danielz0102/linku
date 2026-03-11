const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class Email {
  readonly value: string

  constructor(value: string) {
    if (!EMAIL_REGEX.test(value)) {
      throw new Error("Invalid email format")
    }

    this.value = value
  }
}
