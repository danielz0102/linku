import { uploadPicture } from "#middlewares/upload-picture.js"
import { validate } from "#middlewares/validate.js"
import { registrationSchema } from "#schemas/registration-schema.js"
import { Router } from "express"

const router = Router()

router.post(
  "/register",
  uploadPicture,
  validate(registrationSchema),
  (req, res) => {
    res.send(req.body)
  }
)

export { router as authRouter }
