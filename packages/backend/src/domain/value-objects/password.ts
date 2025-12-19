import { createCustomError } from "../utils/create-custom-error.js"

export class Password {
  private constructor(private readonly value: string) {}

  static create(rawPassword: string): Password {
    const validation = Password.validate(rawPassword)

    if (!validation.isValid) {
      throw new InvalidPasswordError(validation.errors.join("; "))
    }

    return new Password(rawPassword)
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

  getValue(): string {
    return this.value
  }
}

export const InvalidPasswordError = createCustomError("InvalidPasswordError")
