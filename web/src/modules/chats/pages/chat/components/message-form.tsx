import { IconSend } from "@tabler/icons-react"
import { useId, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { Dialog } from "~/shared/components/dialog"

import "./attachment-button.css"
import { AttachmentButton } from "./attachment-button"
import { validateImageFile } from "../validate-image-file"

type MessageFormProps = {
  initialMessage?: string
  onSubmit: (data: { file?: File; message?: string }) => void
}

type ImageData =
  | {
      file: File
      error?: never
    }
  | {
      file?: never
      error: string
    }
  | {
      file?: never
      error?: never
    }

const isEnter = (e: React.KeyboardEvent) => {
  return e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing
}

const getMessageData = (formData: FormData) => {
  const message = formData.get("message")
  const fileData = formData.get("file")

  const trimmed = typeof message === "string" ? message.trim() : undefined
  const file = fileData instanceof File ? fileData : undefined
  return { trimmed, file }
}

export function MessageForm({ onSubmit, initialMessage }: MessageFormProps) {
  const messageId = useId()
  const dlgRef = useRef<HTMLDialogElement>(null)
  const [imageData, setImageData] = useState<ImageData>({})

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const { trimmed, file } = getMessageData(formData)

        if (!trimmed && !file) {
          return
        }

        onSubmit({ file, message: trimmed })
        e.currentTarget.reset()
        setImageData({})
        dlgRef.current?.close()
      }}
      className="message-form text-foreground flex items-center gap-2 rounded-3xl border border-blue-200 bg-blue-100 px-4 py-2"
    >
      <AttachmentButton
        className="self-end"
        onFileChange={(e) => {
          const file = e.currentTarget.files?.[0]

          if (!file) {
            setImageData({})
            return
          }

          const { isValid, error } = validateImageFile(file)

          if (!isValid) {
            setImageData({ error })
            return
          }

          setImageData({ file })
        }}
      />

      <div
        role="alert"
        className="image-error on-top min-w-[20ch] rounded bg-red-300 px-1 py-1 text-center text-sm text-red-950 md:px-2"
        data-show={Boolean(imageData.error)}
        onAnimationEnd={() =>
          setImageData((prev) => ({
            file: prev.file,
            error: undefined,
          }))
        }
      >
        {imageData.error}
      </div>

      {imageData.file && (
        <button
          className="on-top cursor-pointer transition-transform hover:-translate-y-1"
          type="button"
          onClick={() => dlgRef.current?.showModal()}
          aria-label="Open image preview"
        >
          <img
            src={URL.createObjectURL(imageData.file)}
            alt=""
            className="max-h-32 rounded object-contain"
          />
        </button>
      )}

      {typeof document !== "undefined" &&
        createPortal(
          <Dialog ref={dlgRef}>
            <img
              src={imageData.file ? URL.createObjectURL(imageData.file) : undefined}
              alt="Preview"
              className="max-h-[80dvh] max-w-[90vw] rounded object-contain"
            />
          </Dialog>,
          document.body,
        )}

      <label htmlFor={messageId} className="sr-only">
        Message
      </label>
      <textarea
        id={messageId}
        placeholder="Type a message"
        name="message"
        onKeyDown={(e) => {
          if (isEnter(e)) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
        className="field-sizing-content max-h-50 flex-1 resize-none outline-none"
        defaultValue={initialMessage}
        required
      />

      <button
        type="submit"
        className="cursor-pointer self-end transition-transform hover:scale-115"
        aria-label="Send message"
      >
        <IconSend strokeWidth={1.5} aria-hidden />
      </button>
    </form>
  )
}
