import type { RequestHandler } from "express"
import z from "zod"

import { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from "#env.ts"
import { cloudinary } from "#shared/cloudinary-client.ts"

const folder = "linku/attachments"

export const signAttachmentUploadRequestSchema = z.object({ messageId: z.string().nonempty() })

export const signAttachmentUploadHTTPController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const result = signAttachmentUploadRequestSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body", details: result.error.issues })
  }

  const { messageId } = result.data

  const timestamp = Math.floor(Date.now() / 1000)
  const public_id = `message-${messageId}`
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
