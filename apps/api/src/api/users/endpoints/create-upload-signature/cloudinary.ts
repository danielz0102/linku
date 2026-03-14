import cloudinary from "cloudinary"

import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "#env.js"

cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
})

export const cloudinaryClient = cloudinary.v2

export const CloudinaryFolders = {
  PROFILE_PICTURES: "linku/profile-pictures",
}
