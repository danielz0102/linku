import { allowedImageMimeTypes } from "#domain/constants/allowed-image-mime-types.js"
import type { Request, Response, NextFunction } from "express"
import multer from "multer"

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(_, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!allowedImageMimeTypes.includes(file.mimetype as any)) {
      return cb(new Error("INVALID_IMAGE_TYPE"))
    }

    cb(null, true)
  },
}).single("picture")

export function uploadPicture(req: Request, res: Response, next: NextFunction) {
  upload(req, res, (err) => {
    if (err instanceof Error && err.message === "INVALID_IMAGE_TYPE") {
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
