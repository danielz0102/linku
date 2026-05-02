import { Router } from "express"

import { signProfilePictureUploadHTTPController } from "#modules/files/commands/sign-profile-picture-upload-http-controller.ts"

export const fileRouter = Router()

fileRouter.post("/uploads/profile-picture", signProfilePictureUploadHTTPController)
