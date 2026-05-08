import { API_URL } from "~/env"
import { uploadFile, type UploadSignature } from "~/shared/upload-file"

export async function uploadAttachment(messageId: string, file: File) {
  const signature = await getAttachmentUploadSignature(messageId)
  return uploadFile(file, signature)
}

async function getAttachmentUploadSignature(messageId: string): Promise<UploadSignature> {
  const res = await fetch(`${API_URL}/files/uploads/attachment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messageId }),
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to upload signature", { cause: { status: res.status } })
  }

  return res.json()
}
