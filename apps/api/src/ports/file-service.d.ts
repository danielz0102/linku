import type { UploadableFile } from "#domain/entities/user.d.js"

export interface FileService {
  uploadFile(file: UploadableFile): Promise<string>
}
