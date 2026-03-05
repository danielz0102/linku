import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "#shared/config/env.js"
import type { LinkuAPI } from "@linku/api-contract"
import cloudinary from "cloudinary"

cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
})

const folder = "linku/profile-pictures"

export function createUploadSignature(): LinkuAPI.UploadSignature["ResponseBody"] {
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      folder,
      timestamp,
    },
    CLOUDINARY_API_SECRET
  )

  return {
    signature,
    timestamp,
    cloudName: CLOUDINARY_NAME,
    apiKey: CLOUDINARY_API_KEY,
    folder,
  }
}
