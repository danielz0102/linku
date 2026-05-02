import { API_URL } from "~/env"
import type { UploadSignature } from "~/shared/upload-file"

export async function getProfilePictureUploadSignature(): Promise<UploadSignature> {
  const res = await fetch(`${API_URL}/files/uploads/profile-picture`, {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to get Cloudinary signature", { cause: { status: res.status } })
  }

  return res.json()
}
