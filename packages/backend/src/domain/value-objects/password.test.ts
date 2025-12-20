import { InvalidPasswordError, Password } from "./password"

describe("Password", () => {
  it("creates Password instance with valid password", () => {
    const password = new Password("ValidPass123!")
    expect(password.value).toBe("ValidPass123!")
  })

  it("throws InvalidPasswordError for invalid password", () => {
    expect(() => {
      new Password("short")
    }).toThrow(InvalidPasswordError)
  })

  it("throws error with combined error messages", () => {
    expect(() => {
      new Password("invalid")
    }).toThrow(/Must be at least 8 characters long/)
  })

  it("creates Password with exactly 8 characters when valid", () => {
    const password = new Password("Valid12!")
    expect(password.value).toHaveLength(8)
  })
})

describe("Password.value", () => {
  it("is the original password value", () => {
    const rawPassword = "SecurePass123!"
    const password = new Password(rawPassword)
    expect(password.value).toBe(rawPassword)
  })
})

describe("Password.validate", () => {
  it("accepts valid password with all requirements", () => {
    const result = Password.validate("ValidPass123!")
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("rejects password shorter than 8 characters", () => {
    const result = Password.validate("Short1!")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain("Must be at least 8 characters long")
  })

  it("rejects password without uppercase letter", () => {
    const result = Password.validate("lowercase123!")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      "Must contain at least one uppercase letter"
    )
  })

  it("rejects password without lowercase letter", () => {
    const result = Password.validate("UPPERCASE123!")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      "Must contain at least one lowercase letter"
    )
  })

  it("rejects password without number", () => {
    const result = Password.validate("NoNumbersHere!")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain("Must contain at least one number")
  })

  it("rejects password without special character", () => {
    const result = Password.validate("NoSpecialChar123")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      "Must contain at least one special character"
    )
  })

  it("returns multiple errors for password with multiple violations", () => {
    const result = Password.validate("short")
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
    expect(result.errors).toContain("Must be at least 8 characters long")
    expect(result.errors).toContain(
      "Must contain at least one uppercase letter"
    )
    expect(result.errors).toContain("Must contain at least one number")
    expect(result.errors).toContain(
      "Must contain at least one special character"
    )
  })

  it("accepts password with various special characters", () => {
    const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"]

    specialChars.forEach((char) => {
      const result = Password.validate(`ValidPass123${char}`)
      expect(result.isValid).toBe(true)
    })
  })
})
