import {
  cloudinaryClient,
  CloudinaryFolders,
} from "#shared/config/cloudinary.js"
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "#shared/config/env.js"
import type { LinkuAPI } from "@linku/api-contract"

export function createUploadSignature(): LinkuAPI.UploadSignature["ResponseBody"] {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinaryClient.utils.api_sign_request(
    {
      folder: CloudinaryFolders.PROFILE_PICTURES,
      timestamp,
    },
    CLOUDINARY_API_SECRET
  )

  return {
    signature,
    timestamp,
    cloudName: CLOUDINARY_NAME,
    apiKey: CLOUDINARY_API_KEY,
    folder: CloudinaryFolders.PROFILE_PICTURES,
  }
}
