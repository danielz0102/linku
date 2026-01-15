import { PasswordHasher } from "#ports/password-hasher.js"
import { vi } from "vitest"

export function createHasherMock(salt = 1) {
  const HasherMock = vi.fn(
    class extends PasswordHasher {
      override hash = vi.fn()
      override compare = vi.fn(() => Promise.resolve(true))
    }
  )

  return new HasherMock(salt)
}
