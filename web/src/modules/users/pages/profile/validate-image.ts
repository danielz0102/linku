const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function validateImageFile(file: File): string | undefined {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only JPG, JPEG, PNG, and WEBP images are allowed"
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image size must be 5MB or less"
  }
}
