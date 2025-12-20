import { createCustomError } from "../utils/create-custom-error.js"

export class Password {
  public readonly value: string

  constructor(value: string) {
    const validation = Password.validate(value)

    if (!validation.isValid) {
      throw new InvalidPasswordError(validation.errors.join("; "))
    }

    this.value = value
  }

  static validate(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Must be at least 8 characters long")
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain at least one uppercase letter")
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Must contain at least one lowercase letter")
    }

    if (!/[\d]/.test(password)) {
      errors.push("Must contain at least one number")
    }

    if (!/[^A-Za-z\d]/.test(password)) {
      errors.push("Must contain at least one special character")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

export const InvalidPasswordError = createCustomError("InvalidPasswordError")
