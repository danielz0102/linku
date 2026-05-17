import { API_URL } from "~/env"
import { uploadFile, type UploadSignature } from "~/shared/upload-file"

export async function uploadProfilePicture(file: File) {
  const signature = await getProfilePictureUploadSignature()
  return uploadFile(file, signature)
}

async function getProfilePictureUploadSignature(): Promise<UploadSignature> {
  const res = await fetch(`${API_URL}/files/uploads/profile-picture`, {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to get Cloudinary signature", { cause: { status: res.status } })
  }

  return res.json()
}
