import type { UserRepository } from "#ports/user-repository.d.js"
import { vi } from "vitest"

export function createUserRepositoryMock() {
  return {
    findBy: vi.fn<UserRepository["findBy"]>(),
  } satisfies UserRepository
}
