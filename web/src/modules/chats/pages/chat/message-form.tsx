import { IconSend } from "@tabler/icons-react"
import { IconPhoto } from "@tabler/icons-react"
import { useRef } from "react"

type MessageFormProps = {
  onSubmit: (data: { file?: File; message?: string }) => void
}

export function MessageForm({ onSubmit }: MessageFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const trimmedContent = textRef.current?.value.trim()
        const file = fileInputRef.current?.files?.[0]

        if (!trimmedContent && !file) {
          return
        }

        onSubmit({ file, message: trimmedContent })
        e.currentTarget.reset()
      }}
      className="text-foreground flex items-center gap-2 rounded-3xl border border-blue-200 bg-blue-100 px-4 py-2"
    >
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

      <textarea
        ref={textRef}
        placeholder="Type a message"
        name="message"
        onKeyDown={(e) => {
          if (e.key !== "Enter") {
            return
          }

          if (e.nativeEvent.isComposing) {
            return
          }

          if (e.shiftKey) {
            return
          }

          e.preventDefault()
          e.currentTarget.form?.requestSubmit()
        }}
        className="field-sizing-content max-h-50 flex-1 resize-none outline-none"
        cols={5}
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
