import cloudinary from "cloudinary"

import { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from "#env.ts"

cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
  secure: true,
})

export const CloudinaryFolders = {
  PROFIILE_PICTURES: "linku/profile-pictures",
}

const cloudinaryClient = cloudinary.v2

export { cloudinaryClient as cloudinary }
