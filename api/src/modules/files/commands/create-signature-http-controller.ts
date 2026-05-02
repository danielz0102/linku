import type { RequestHandler } from "express"
import { z } from "zod"

import { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from "#env.ts"
import { cloudinary } from "#shared/cloudinary-client.ts"

export const CloudinaryFolders = {
  PROFILE_PICTURES: "linku/profile-pictures",
  ATTACHMENTS: "linku/attachments",
}

export const signatureRequestSchema = z.object({
  type: z.enum(["profile-picture", "attachment"]),
})

export const createSignatureHTTPController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const result = signatureRequestSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body", details: result.error.issues })
  }

  const folder =
    result.data.type === "profile-picture"
      ? CloudinaryFolders.PROFILE_PICTURES
      : CloudinaryFolders.ATTACHMENTS

  const timestamp = Math.floor(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
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
    folder: folder,
    public_id: userId,
  })
}
