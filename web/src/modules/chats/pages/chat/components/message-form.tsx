import { IconSend } from "@tabler/icons-react"
import { useId, useState } from "react"
import { useForm, type UseFormRegisterReturn } from "react-hook-form"

import { AttachmentButton } from "./attachment-button"

import "./attachment-button.css"

type MessageFormInputs = {
  message: string
  files?: FileList
}

type MessageFormProps = {
  onSubmit: (data: { file?: File; message?: string }) => void
}

export function MessageForm({ onSubmit }: MessageFormProps) {
  // File inputs values are always undefined after calling reset() on submit
  // A default value cannot be set for file inputs to override the undefined value
  // Using a key to force remount renders a new file input with a fresh FileList
  const [attachmentKey, setAttachmentKey] = useState(0)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<MessageFormInputs>({ mode: "onChange" })

  const selectedFile = watch("files")?.[0]

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({ file: data.files?.[0], message: data.message || undefined })
        reset()
        setAttachmentKey((v) => v + 1)
      })}
      className="text-foreground flex items-center gap-2 rounded-3xl border border-blue-200 bg-blue-100 px-4 py-2"
    >
      <AttachmentButton
        key={attachmentKey}
        {...register("files", {
          validate: (files) => {
            const file = files?.[0]

            if (!file) return true

            if (!file.type.startsWith("image/")) {
              return "Only image files are allowed"
            }

            if (file.size > 5 * 1024 * 1024) {
              return "File size must be less than 5MB"
            }
          },
        })}
        className="self-end"
      >
        <AttachmentButton.ErrorTooltip>{errors.files?.message}</AttachmentButton.ErrorTooltip>
        <AttachmentButton.PreviewImageButton file={selectedFile} />
      </AttachmentButton>

      <MessageTextArea {...register("message", { setValueAs: (v) => v.trim() })} />

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

function MessageTextArea(props: UseFormRegisterReturn) {
  const id = useId()

  return (
    <>
      <label htmlFor={id} className="sr-only">
        Message
      </label>
      <textarea
        id={id}
        placeholder="Type a message"
        className="field-sizing-content max-h-50 flex-1 resize-none outline-none"
        {...props}
      />
    </>
  )
}
