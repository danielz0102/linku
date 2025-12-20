import { createCustomError } from "../utils/create-custom-error.js"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class Email {
  public readonly value: string

  constructor(value: string) {
    const normalized = value.trim().toLowerCase()

    if (!Email.validate(normalized)) {
      throw new InvalidEmailError("Invalid email format", {
        cause: { value },
      })
    }

    this.value = normalized
  }

  static validate(email: string): boolean {
    return EMAIL_PATTERN.test(email)
  }
}

export const InvalidEmailError = createCustomError("InvalidEmailError")
