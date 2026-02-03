import { register } from "#controllers/register.js"
import { uploadPicture } from "#middlewares/upload-picture.js"
import { registrationValidator } from "#validators/registration-validator.js"
import { Router } from "express"

const router = Router()

router.post("/register", uploadPicture, registrationValidator, register)

export { router as authRouter }
