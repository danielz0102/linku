export type MessageBubbleProps = {
  text?: string
  attachmentUrl?: string
  belongsToUser?: boolean
}

export function MessageBubble({ text, attachmentUrl, belongsToUser = true }: MessageBubbleProps) {
  return (
    <article
      className={`flex max-w-[50%] flex-col gap-2 rounded-2xl p-3 wrap-break-word ${
        belongsToUser
          ? "self-end rounded-br-sm bg-blue-300 text-black"
          : "self-start rounded-bl-sm bg-blue-100"
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
