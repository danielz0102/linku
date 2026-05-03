import type { RequestHandler } from "express"
import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"

import { UpdateProfilePictureCommandHandler } from "./update-profile-picture-command-handler.ts"

const updateProfilePicture = new UpdateProfilePictureCommandHandler(db)
const updateProfilePictureRequestSchema = z.object({
  publicId: z.string().trim().nonempty(),
  publicUrl: z.url({ protocol: /^https$/, hostname: z.regexes.domain }),
})

export const updateProfilePictureController: RequestHandler = async (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    return res.sendStatus(401)
  }

  const result = updateProfilePictureRequestSchema.safeParse(req.body)

  if (!result.success) {
    return res.sendValidationError(result.error.issues)
  }

  await updateProfilePicture.execute({
    userId,
    publicId: result.data.publicId,
    publicUrl: result.data.publicUrl,
  })

  return res.sendStatus(204)
}
