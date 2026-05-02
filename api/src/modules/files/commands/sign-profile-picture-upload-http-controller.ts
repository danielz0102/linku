import type { RequestHandler } from "express"

import { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from "#env.ts"
import { cloudinary } from "#shared/cloudinary-client.ts"

const folder = "linku/profile-pictures"

export const signProfilePictureUploadHTTPController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const public_id = `user-${userId}`
  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      public_id,
      timestamp,
    },
    CLOUDINARY_SECRET
  )

  return res.json({
    signature,
    timestamp,
    cloudName: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    folder: folder,
    public_id,
  })
}
