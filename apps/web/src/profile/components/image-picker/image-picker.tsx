import { Camera, Pencil } from "lucide-react"
import { useRef } from "react"
import { useImage } from "./use-image"

type ImagePickerProps = {
  defaultImage?: string | null
  onChange?: (file: File | null) => void
}

export function ImagePicker({ defaultImage, onChange }: ImagePickerProps) {
  const { preview, error, updateImage } = useImage()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => {
          inputRef.current?.click()
        }}
        className="group relative cursor-pointer focus:outline-none"
      >
        <div
          data-invalid={error ? true : undefined}
          className="flex size-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-neutral-600 bg-neutral-800 transition-colors group-hover:border-neutral-500 group-focus:border-blue-500 data-invalid:border-red-500"
        >
          {preview || defaultImage ? (
            <img
              src={preview || defaultImage || undefined}
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

        <div
          data-show={error ? undefined : true}
          className="fade absolute right-0 bottom-0 flex size-10 items-center justify-center rounded-full border-4 border-blue-950 bg-blue-600"
        >
          <Pencil className="size-4 text-white" />
        </div>

        {error && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/70">
            <p role="status" className="text-sm font-medium text-white">
              Invalid image
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            onChange?.(updateImage(file))
          }}
          className="hidden"
          name="image"
        />
      </button>
      {error && (
        <p role="status" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
