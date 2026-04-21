type MessageProps = {
  text?: string
  attachmentUrl?: string
  isLeft?: boolean
}

export function MessageBubble({ text, attachmentUrl, isLeft = true }: MessageProps) {
  return (
    <article
      className={`flex max-w-[50%] flex-col gap-2 rounded-2xl p-3 wrap-break-word ${
        isLeft
          ? "self-start rounded-bl-sm bg-blue-100"
          : "self-end rounded-br-sm bg-blue-300 text-black"
      }`}
    >
      {attachmentUrl && (
        <img
          src={attachmentUrl}
          alt="Attachment preview"
          className="max-h-80 w-full rounded-lg object-cover"
          loading="lazy"
        />
      )}
      {text && <p>{text}</p>}
    </article>
  )
}
