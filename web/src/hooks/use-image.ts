import { useState } from "react"

export function useImage() {
  const [preview, setPreview] = useState<string | null>(null)

  const updatePreview = (file: File | null) => {
    if (!file) {
      setPreview(null)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return { preview, updatePreview }
}
