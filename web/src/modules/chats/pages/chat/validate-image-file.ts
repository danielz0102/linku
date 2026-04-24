export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

type ImageValidationResult =
  | {
      isValid: true
      error?: never
    }
  | {
      isValid: false
      error: "INVALID_TYPE" | "FILE_TOO_LARGE"
    }

export function validateImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return {
      isValid: false,
      error: "INVALID_TYPE",
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: "FILE_TOO_LARGE",
    }
  }

  return { isValid: true }
}
