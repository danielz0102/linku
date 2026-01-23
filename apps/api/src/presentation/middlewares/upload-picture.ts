import { allowedImageMimeTypes } from "#domain/constants/allowed-image-mime-types.js"
import { createCustomError } from "#lib/create-custom-error.js"
import type { Request, Response, NextFunction } from "express"
import multer from "multer"

const InvalidImageTypeError = createCustomError("InvalidImageTypeError")

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(_, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!allowedImageMimeTypes.includes(file.mimetype as any)) {
      return cb(new InvalidImageTypeError("Invalid image type"))
    }

    cb(null, true)
  },
}).single("picture")

export function uploadPicture(req: Request, res: Response, next: NextFunction) {
  upload(req, res, (err) => {
    if (err instanceof InvalidImageTypeError) {
      return res.status(400).json({
        error: "Invalid image type",
        allowedTypes: allowedImageMimeTypes,
      })
    }

    if (err) {
      return next(err)
    }

    next()
  })
}
