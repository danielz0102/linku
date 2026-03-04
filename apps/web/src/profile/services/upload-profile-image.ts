import axios from "axios"
import { getUploadSignature } from "./get-upload-signature"

type CloudinaryUploadResponse = {
  secure_url: string
}

export async function uploadProfileImage(file: File): Promise<string> {
  const { signature, timestamp, cloudName, apiKey, folder } =
    await getUploadSignature()

  const formData = new FormData()
  formData.append("file", file)
  formData.append("signature", signature)
  formData.append("timestamp", timestamp.toString())
  formData.append("api_key", apiKey)
  formData.append("folder", folder)

  const { data } = await axios.post<CloudinaryUploadResponse>(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  )

  return data.secure_url
}
