import { IconSend } from "@tabler/icons-react"
import { useId } from "react"

import { AttachmentButton } from "./attachment-button"

type MessageFormProps = {
  initialMessage?: string
  onSubmit: (data: { file?: File; message?: string }) => void
}

export function MessageForm({ onSubmit, initialMessage }: MessageFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const { message, file } = getMessageData(formData)

        if (!message && !file) {
          return
        }

        onSubmit({ file, message })
        e.currentTarget.reset()
      }}
      className="text-foreground flex items-center gap-2 rounded-3xl border border-blue-200 bg-blue-100 px-4 py-2"
    >
      <AttachmentButton className="self-end" />
      <MessageTextArea defaultValue={initialMessage} />

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

function getMessageData(formData: FormData) {
  const message = formData.get("message")
  const fileData = formData.get("file")

  const trimmed = typeof message === "string" ? message.trim() : undefined
  const file = fileData instanceof File ? fileData : undefined
  return { message: trimmed, file }
}

type MessageTextAreaProps = {
  defaultValue?: string
}

function MessageTextArea({ defaultValue }: MessageTextAreaProps) {
  const id = useId()

  return (
    <>
      <label htmlFor={id} className="sr-only">
        Message
      </label>
      <textarea
        id={id}
        placeholder="Type a message"
        name="message"
        onKeyDown={(e) => {
          if (isEnter(e)) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
        className="field-sizing-content max-h-50 flex-1 resize-none outline-none"
        defaultValue={defaultValue}
        required
      />
    </>
  )
}

function isEnter(e: React.KeyboardEvent) {
  return e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing
}
