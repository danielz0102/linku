import multer from "multer"

export const uploadPicture = multer({
  storage: multer.memoryStorage(),
  fileFilter(_, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(null, false)
    }

    cb(null, true)
  },
}).single("picture")
