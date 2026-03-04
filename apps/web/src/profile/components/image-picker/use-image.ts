import { useEffect, useState } from "react"

export function useImage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (error) {
      const id = setTimeout(() => {
        setError(null)
      }, 3000)

      return () => clearTimeout(id)
    }
  }, [error])

  const updateImage = (file: File | null) => {
    if (!file) {
      setPreview(null)
      setError(null)
      return null
    }

    const result = imageValidationError(file)

    if (result) {
      setError(result)
      return null
    }

    setError(null)
    setPreview(URL.createObjectURL(file))
    return file
  }

  return { preview, error, updateImage }
}

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
const maxSize = 5 * 1024 * 1024

function imageValidationError(file: File) {
  if (!allowedMimeTypes.includes(file.type)) {
    return "Allowed files are: JPEG, PNG, JPG, WEBP"
  }

  if (file.size > maxSize) {
    return "Picture file cannot be larger than 5MB"
  }
}
