const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

type ImageValidationResult =
  | {
      isValid: true
      error?: never
    }
  | {
      isValid: false
      error: string
    }

export function validateImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return {
      isValid: false,
      error: "File must be a JPEG, PNG, WebP, GIF, or AVIF image",
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: "File cannot be larger than 5MB",
    }
  }

  return { isValid: true }
}
