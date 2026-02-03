import { useEffect, useState } from "react"

export function useImage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    if (invalid) {
      const id = setTimeout(() => {
        setInvalid(false)
      }, 3000)

      return () => clearTimeout(id)
    }
  }, [invalid])

  const updateImage = (file: File | null) => {
    if (!file) {
      setPreview(null)
      return
    }

    if (!imageIsValid(file)) {
      setInvalid(true)
      return
    }

    setInvalid(false)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return { preview, invalid, updateImage }
}

function imageIsValid(file: File) {
  return file.type.startsWith("image/")
}
