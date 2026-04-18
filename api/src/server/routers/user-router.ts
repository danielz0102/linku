import { Router } from "express"

import { createCloudinarySignatureHandler } from "#modules/users/commands/create-cloudinary-signature/create-cloudinary-signature-http-handler.ts"
import { signUpHandler } from "#modules/users/commands/sign-up/sign-up-http-handler.ts"
import { updateUserHandler } from "#modules/users/commands/update-user/update-user-http-handler.ts"
import { whoamiHandler } from "#modules/users/queries/whoami/whoami-http-handler.ts"

export const userRouter = Router()

userRouter.post("/", signUpHandler)
userRouter.get("/me", whoamiHandler)
userRouter.put("/me", updateUserHandler)
userRouter.post("/cloudinary-signature", createCloudinarySignatureHandler)
