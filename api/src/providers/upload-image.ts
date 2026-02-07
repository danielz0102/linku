import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "#config/env.js"
import cloudinary from "cloudinary"

cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadImage(buffer: Buffer): Promise<string> {
  const { promise, resolve, reject } =
    Promise.withResolvers<cloudinary.UploadApiResponse>()

  cloudinary.v2.uploader
    .upload_stream({ folder: "linku/profile-pictures" }, (error, result) => {
      if (error) {
        return reject(error)
      }

      if (!result) {
        return reject(
          new Error("No result from Cloudinary", {
            cause: {
              error,
              result,
              buffer,
            },
          })
        )
      }

      resolve(result)
    })
    .end(buffer)

  const { secure_url } = await promise
  return secure_url
}
