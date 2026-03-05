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
import type { RequestHandler } from "express"

export const uploadSignatureHandler: RequestHandler<
  never,
  LinkuAPI.UploadSignature["ResponseBody"]
> = (_req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinaryClient.utils.api_sign_request(
    {
      folder: CloudinaryFolders.PROFILE_PICTURES,
      timestamp,
    },
    CLOUDINARY_API_SECRET
  )

  return res.status(200).json({
    signature,
    timestamp,
    cloudName: CLOUDINARY_NAME,
    apiKey: CLOUDINARY_API_KEY,
    folder: CloudinaryFolders.PROFILE_PICTURES,
  })
}
