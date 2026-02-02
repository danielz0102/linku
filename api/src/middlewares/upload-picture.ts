import type { RequestHandler } from "express"
import multer from "multer"

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(_, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, false)
    }
    cb(null, true)
  },
}).single("picture")

export const uploadPicture: RequestHandler = (req, res, _next) => {
  upload(req, res, () => {
    res.status(400).json({
      error: "Invalid image file",
      allowedMimeTypes: allowedMimeTypes,
    })
  })
}
