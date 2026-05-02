import { API_URL } from "~/env"

type GetCloudinarySignatureResponse = {
  signature: string
  timestamp: number
  cloudName: string
  api_key: string
  folder: string
  public_id: string
}

export async function getCloudinarySignature(): Promise<GetCloudinarySignatureResponse> {
  const res = await fetch(`${API_URL}/files/sign`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "profile-picture" }),
  })

  if (!res.ok) {
    throw new Error("Failed to get Cloudinary signature", { cause: { status: res.status } })
  }

  return res.json()
}
