import { registerController } from "#controllers/register.js"
import { uploadPicture } from "#middlewares/upload-picture.js"
import { validateRegistration } from "#middlewares/validate-registration.js"
import { Router } from "express"

const router = Router()

router.post(
  "/register",
  uploadPicture,
  validateRegistration,
  registerController
)

export { router as userRouter }
