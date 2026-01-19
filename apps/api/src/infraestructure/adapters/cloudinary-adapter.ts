import type { FileService } from "#application/ports/file-service.d.js"
import cloudinary from "#infraestructure/config/cloudinary.js"

export class CloudinaryAdapter implements FileService {
  async uploadProfilePic(url: string): Promise<string> {
    const uploadResult = await cloudinary.uploader.upload(url, {
      folder: "linku/profile-pictures",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: {
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
    })

    return uploadResult.secure_url
  }
}
