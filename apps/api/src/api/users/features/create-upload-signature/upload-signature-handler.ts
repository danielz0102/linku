import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "#env.js"

import { cloudinaryClient, CloudinaryFolders } from "./cloudinary.js"

export const uploadSignatureHandler: RequestHandler<
  never,
  LinkuAPI.UploadSignature["ResponseBody"]
> = (req, res) => {
  const { userId } = req.session

  if (!userId) {
    throw new Error("User ID is missing in session", {
      cause: { session: req.session },
    })
  }

  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinaryClient.utils.api_sign_request(
    {
      folder: CloudinaryFolders.PROFILE_PICTURES,
      public_id: userId,
      timestamp,
    },
    CLOUDINARY_API_SECRET
  )

  return res.status(200).json({
    signature,
    timestamp,
    cloudName: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    folder: CloudinaryFolders.PROFILE_PICTURES,
    public_id: userId,
  })
}
