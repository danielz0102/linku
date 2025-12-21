import { vi } from "vitest"
import type { PasswordHasher } from "~/application/ports/password-hasher.js"

export const mockHasher = vi.mockObject<PasswordHasher>({
  hash: vi.fn(),
  compare: vi.fn(),
})
