import type { UserRepository } from "#application/ports/user-repository.d.js"
import { vi, type Mocked } from "vitest"

export const createUserRepositoryMock = (): Mocked<UserRepository> => ({
  findBy: vi.fn(),
  create: vi.fn(),
  deleteBy: vi.fn(),
})
