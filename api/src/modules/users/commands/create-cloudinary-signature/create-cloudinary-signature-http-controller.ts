import type { RequestHandler } from "express"

import { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from "#env.ts"
import { cloudinary, CloudinaryFolders } from "#shared/cloudinary-client.ts"

export const createCloudinarySignatureController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      folder: CloudinaryFolders.PROFILE_PICTURES,
      public_id: userId,
      timestamp,
    },
    CLOUDINARY_SECRET
  )

  return res.json({
    signature,
    timestamp,
    cloudName: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    folder: CloudinaryFolders.PROFILE_PICTURES,
    public_id: userId,
  })
}
