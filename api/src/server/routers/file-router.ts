import { Router } from "express"

import { signAttachmentUploadHTTPController } from "#modules/files/commands/sign-attachment-upload-http-controller.ts"
import { signProfilePictureUploadHTTPController } from "#modules/files/commands/sign-profile-picture-upload-http-controller.ts"

export const fileRouter = Router()

fileRouter.post("/uploads/profile-picture", signProfilePictureUploadHTTPController)
fileRouter.post("/uploads/attachment", signAttachmentUploadHTTPController)
