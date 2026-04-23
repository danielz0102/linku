import { IconPhoto } from "@tabler/icons-react"
import { useRef, useState } from "react"

import { validateImageFile } from "../validate-image-file"

import "./attachment-button.css"

export function AttachmentButton() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="attachment-button">
      <button
        type="button"
        className="grid cursor-pointer content-center transition-transform hover:scale-115"
        onClick={() => fileInputRef.current?.click()}
      >
        <IconPhoto strokeWidth={1.5} aria-label="Attach an image" />
      </button>

      <input
        ref={fileInputRef}
        name="file"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.currentTarget.files?.[0]

          if (!file) {
            setError(null)
            return
          }

          const { isValid, error } = validateImageFile(file)

          if (!isValid) {
            setError(error)
            return
          }

          setError(null)
          e.currentTarget.form?.requestSubmit()
        }}
      />

      <div
        role="status"
        className="image-error min-w-[20ch] rounded bg-red-300 px-1 py-1 text-center text-sm text-red-950 md:px-2"
        data-show={Boolean(error)}
        onAnimationEnd={() => setError(null)}
      >
        {error}
      </div>
    </div>
  )
}
