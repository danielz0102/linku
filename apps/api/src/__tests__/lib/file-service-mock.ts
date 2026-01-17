import { FileService } from "#ports/file-service.js"
import { vi } from "vitest"

export function createFileServiceMock() {
  const FileServiceMock = vi.fn(
    class extends FileService {
      override uploadFile = vi.fn<FileService["uploadFile"]>()
    }
  )

  return new FileServiceMock()
}
