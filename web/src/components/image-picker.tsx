import { Camera, Pencil } from "lucide-react"
import { useRef } from "react"
import { useImage } from "~/hooks/use-image"

type ImagePickerProps = {
  onChange?: (file: File | null) => void
  onError?: () => void
}

export function ImagePicker({ onChange, onError }: ImagePickerProps) {
  const { preview, updatePreview } = useImage()
  const inputRef = useRef<HTMLInputElement>(null)

  const validateImage = (file: File) => {
    return file.type.startsWith("image/")
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => {
          inputRef.current?.click()
        }}
        className="group relative cursor-pointer focus:outline-none"
      >
        <div className="flex size-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-neutral-600 bg-neutral-800 transition-colors group-hover:border-neutral-500 group-focus:border-blue-500">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="size-full object-cover"
            />
          ) : (
            <Camera
              className="size-10 text-neutral-500"
              aria-label="Choose profile picture"
            />
          )}
        </div>
        <div className="absolute right-0 bottom-0 flex size-10 items-center justify-center rounded-full border-4 border-blue-950 bg-blue-600">
          <Pencil className="size-4 text-white" />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null

            if (file && !validateImage(file)) {
              onError?.()
              return
            }

            updatePreview(file)
            onChange?.(file)
          }}
          className="hidden"
          name="image"
        />
      </button>
    </div>
  )
}
