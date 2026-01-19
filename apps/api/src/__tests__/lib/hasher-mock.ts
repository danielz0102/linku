import { PasswordHasher } from "#application/ports/password-hasher.js"
import { vi } from "vitest"

class HasherMock extends PasswordHasher {
  override hash = vi.fn<PasswordHasher["hash"]>()
  override compare = vi.fn<PasswordHasher["compare"]>()
}

export function createHasherMock(salt = 1) {
  return new HasherMock(salt)
}
