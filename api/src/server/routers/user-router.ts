import { Router } from "express"

import { createCloudinarySignatureController } from "#modules/users/commands/create-cloudinary-signature/create-cloudinary-signature-http-controller.ts"
import { signUpController } from "#modules/users/commands/sign-up/sign-up-http-controller.ts"
import { updateUserController } from "#modules/users/commands/update-user/update-user-http-controller.ts"
import { searchUserByUsernameController } from "#modules/users/queries/search-user-by-username/search-user-by-username-http-controller.ts"
import { searchUsersController } from "#modules/users/queries/search-users/search-users-http-controller.ts"
import { whoamiController } from "#modules/users/queries/whoami/whoami-http-controller.ts"

export const userRouter = Router()

userRouter.post("/", signUpController)
userRouter.get("/", searchUsersController)
userRouter.get("/me", whoamiController)
userRouter.get("/:username", searchUserByUsernameController)
userRouter.put("/me", updateUserController)
userRouter.post("/cloudinary-signature", createCloudinarySignatureController)
