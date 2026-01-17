import type { FileService } from "#ports/file-service.d.js"
import { vi, type Mocked } from "vitest"

export const createFileServiceMock = (): Mocked<FileService> => ({
  uploadProfilePic: vi.fn(),
})
