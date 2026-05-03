export type UploadSignature = {
  signature: string
  timestamp: number
  cloudName: string
  api_key: string
  folder: string
  public_id: string
}

type CloudinaryResponse = {
  secure_url: string
  public_id: string
}

type UploadData = { url: string; public_id: string }

export async function uploadFile(file: File, signature: UploadSignature): Promise<UploadData> {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("api_key", signature.api_key)
  formData.append("timestamp", signature.timestamp.toString())
  formData.append("signature", signature.signature)
  formData.append("folder", signature.folder)
  formData.append("public_id", signature.public_id)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Failed to upload image", {
      cause: { status: res.status },
    })
  }

  const data = (await res.json()) as CloudinaryResponse

  return { url: data.secure_url, public_id: data.public_id }
}
