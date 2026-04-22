import { IconSend } from "@tabler/icons-react"
import { IconPhoto } from "@tabler/icons-react"
import { useRef } from "react"

type MessageFormProps = React.PropsWithChildren<{
  initialMessage?: string
  onSubmit: (data: { file?: File; message?: string }) => void
}>

export function MessageForm({ onSubmit, children, initialMessage }: MessageFormProps) {
  const isShiftEnter = (e: React.KeyboardEvent) => {
    return e.key === "Enter" && e.shiftKey && !e.nativeEvent.isComposing
  }

  const getMessageData = (formData: FormData) => {
    const message = formData.get("message")
    const fileData = formData.get("file")

    const trimmed = typeof message === "string" ? message.trim() : undefined
    const file = fileData instanceof File ? fileData : undefined
    return { trimmed, file }
  }

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
      }}
      className="text-foreground flex items-center gap-2 rounded-3xl border border-blue-200 bg-blue-100 px-4 py-2"
    >
      {children}

      <textarea
        placeholder="Type a message"
        name="message"
        onKeyDown={(e) => {
          if (!isShiftEnter(e)) {
            return
          }

          e.preventDefault()
          e.currentTarget.form?.requestSubmit()
        }}
        className="field-sizing-content max-h-50 flex-1 resize-none outline-none"
        cols={5}
        defaultValue={initialMessage}
      />

      <button
        type="submit"
        className="cursor-pointer self-end transition-transform hover:scale-115"
      >
        <IconSend strokeWidth={1.5} aria-label="Send message" />
      </button>
    </form>
  )
}

MessageForm.AttachmentButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <button
        type="button"
        className="cursor-pointer self-end transition-transform hover:scale-115"
        onClick={() => fileInputRef.current?.click()}
      >
        <IconPhoto strokeWidth={1.5} aria-label="Attach an image" />
      </button>

      <input
        ref={fileInputRef}
        id="chat-message-image"
        name="file"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.currentTarget.files?.[0]

          if (!file) {
            return
          }

          e.currentTarget.form?.requestSubmit()
        }}
      />
    </>
  )
}
