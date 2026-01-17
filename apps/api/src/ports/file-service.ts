export type UploadableFile = {
  buffer: Buffer
  mimetype: string
  originalname: string
}

export abstract class FileService {
  abstract uploadFile(file: UploadableFile): Promise<string>
}
