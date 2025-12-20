import { Email, InvalidEmailError } from "./email"

describe("Email", () => {
  it("creates Email instance with valid email", () => {
    const email = new Email("user@example.com")
    expect(email.value).toBe("user@example.com")
  })

  it("trims whitespace from email", () => {
    const email = new Email("  user@example.com  ")
    expect(email.value).toBe("user@example.com")
  })

  it("normalizes email to lowercase", () => {
    const email = new Email("User@Example.COM")
    expect(email.value).toBe("user@example.com")
  })

  it("throws InvalidEmailError for invalid email", () => {
    expect(() => {
      new Email("invalid-email")
    }).toThrow(InvalidEmailError)
  })
})

describe("Email.validate", () => {
  it("returns true for valid email", () => {
    expect(Email.validate("user@example.com")).toBe(true)
  })

  it("returns false for email without @", () => {
    expect(Email.validate("userexample.com")).toBe(false)
  })

  it("returns false for email without domain", () => {
    expect(Email.validate("user@")).toBe(false)
  })

  it("returns false for email without local part", () => {
    expect(Email.validate("@example.com")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(Email.validate("")).toBe(false)
    expect(Email.validate("   ")).toBe(false)
  })

  it("returns false for email with spaces", () => {
    expect(Email.validate("user @example.com")).toBe(false)
  })
})
