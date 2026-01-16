import type { UserRepository } from "#ports/user-repository.d.js"
import { vi } from "vitest"

export function createUserRepositoryMock() {
  return vi.mockObject<UserRepository>({
    create: vi.fn(),
    findBy: vi.fn(),
  })
}
