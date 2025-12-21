import { vi } from "vitest"
import type { UserRepository } from "~/domain/repositories/user-repository.js"

export const mockUserRepo = vi.mockObject<UserRepository>({
  register: vi.fn(),
  exists: vi.fn(() => Promise.resolve(false)),
})
