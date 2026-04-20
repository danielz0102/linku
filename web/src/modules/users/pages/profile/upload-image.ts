import { getCloudinarySignature } from "./api/get-cloudinary-signature"

export async function uploadImage(file: File): Promise<{ url: string }> {
  const signature = await getCloudinarySignature()
  const formData = new FormData()

  formData.append("file", file)
  formData.append("api_key", signature.api_key)
  formData.append("timestamp", signature.timestamp.toString())
  formData.append("signature", signature.signature)
  formData.append("folder", signature.folder)
  formData.append("public_id", signature.public_id)

  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!cloudinaryRes.ok) {
    throw new Error("Failed to upload image", {
      cause: { status: cloudinaryRes.status },
    })
  }

  const data = (await cloudinaryRes.json()) as { secure_url?: string }

  if (!data.secure_url) {
    throw new Error("Uploaded image URL is missing", { cause: data })
  }

  return { url: data.secure_url }
}
