import { createCustomError } from "#lib/create-custom-error.js"
import type { RequestHandler } from "express"
import multer from "multer"

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
const InvalidImageFileError = createCustomError("InvalidImageFileError")

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(_, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new InvalidImageFileError("Invalid image file", {
          cause: { mimetype: file.mimetype, allowedMimeTypes },
        })
      )
    }

    cb(null, true)
  },
}).single("picture")

export const uploadPicture: RequestHandler = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof InvalidImageFileError) {
      return res.status(400).json({
        error: err.message,
        details: err.cause,
      })
    }

    next(err)
  })
}
