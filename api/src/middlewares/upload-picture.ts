import { createCustomError } from "#lib/create-custom-error.js"
import type { ErrorBody } from "#types.d.js"
import type { NextFunction, Request, Response } from "express"
import multer from "multer"

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
const ImageMimeTypeError = createCustomError("ImageMimeTypeError")

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(_, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new ImageMimeTypeError("Invalid image file"))
    }

    cb(null, true)
  },
}).single("picture")

export function uploadPicture(
  req: Request,
  res: Response<ErrorBody<"picture">>,
  next: NextFunction
) {
  upload(req, res, (err) => {
    if (err instanceof ImageMimeTypeError) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        errors: {
          picture: `Picture file is invalid. Allowed files are: JPEG, PNG, JPG, WEBP`,
        },
      })
    }

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          errors: {
            picture: "Picture file cannot be larger than 5MB",
          },
        })
      }
    }

    next(err)
  })
}
