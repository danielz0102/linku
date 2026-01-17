import { PasswordHasher } from "#ports/password-hasher.js"
import { vi } from "vitest"

export function createHasherMock(salt = 1) {
  const HasherMock = vi.fn(
    class extends PasswordHasher {
      override hash = vi.fn<PasswordHasher["hash"]>()
      override compare = vi.fn<PasswordHasher["compare"]>()
    }
  )

  return new HasherMock(salt)
}
