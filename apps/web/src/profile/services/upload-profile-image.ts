import type { LinkuAPI } from "@linku/api-contract"

import axios from "axios"

import { apiClient } from "~/shared/api"

type CloudinaryUploadResponse = {
  secure_url?: string
}

export async function uploadProfileImage(file: File): Promise<string> {
  const { signature, timestamp, cloudName, api_key, folder, public_id } = await apiClient
    .post<LinkuAPI.UploadSignature["ResponseBody"]>("/users/upload-signature")
    .then(({ data }) => data)

  const formData = new FormData()
  formData.append("file", file)
  formData.append("public_id", public_id)
  formData.append("signature", signature)
  formData.append("timestamp", timestamp.toString())
  formData.append("api_key", api_key)
  formData.append("folder", folder)

  const { data } = await axios.post<CloudinaryUploadResponse>(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  )
  const { secure_url } = data

  if (!secure_url) {
    throw new Error("Failed to upload image", { cause: { data } })
  }

  return secure_url
}
