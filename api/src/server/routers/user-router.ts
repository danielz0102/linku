import { Router } from "express"

import { createCloudinarySignatureHandler } from "#modules/users/commands/create-cloudinary-signature/create-cloudinary-signature-http-handler.ts"
import { signUpHandler } from "#modules/users/commands/sign-up/sign-up-http-handler.ts"
import { updateUserHandler } from "#modules/users/commands/update-user/update-user-http-handler.ts"
import { searchUserByUsernameHandler } from "#modules/users/queries/search-user-by-username/search-user-by-username-http-handler.ts"
import { searchUsersHandler } from "#modules/users/queries/search-users/search-users-http-handler.ts"
import { whoamiHandler } from "#modules/users/queries/whoami/whoami-http-handler.ts"

export const userRouter = Router()

userRouter.post("/", signUpHandler)
userRouter.get("/", searchUsersHandler)
userRouter.get("/me", whoamiHandler)
userRouter.get("/:username", searchUserByUsernameHandler)
userRouter.put("/me", updateUserHandler)
userRouter.post("/cloudinary-signature", createCloudinarySignatureHandler)
