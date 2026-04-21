import type { Message as MessageEntity } from "~/modules/chats/domain/message"

type MessageProps = {
  message: MessageEntity
  peerId: string
}

export function Message({ message, peerId }: MessageProps) {
  const isPeerMessage = message.senderId === peerId
  const canRenderAttachment =
    message.attachmentUrl &&
    (message.attachmentUrl.protocol === "http:" || message.attachmentUrl.protocol === "https:")

  return (
    <article
      className={`flex max-w-[85%] flex-col gap-2 rounded-2xl p-3 break-words ${
        isPeerMessage
          ? "bg-surface self-start rounded-bl-sm"
          : "bg-primary/10 self-end rounded-br-sm"
      }`}
    >
      {message.content && <p>{message.content}</p>}
      {canRenderAttachment && (
        <img
          src={message.attachmentUrl.toString()}
          alt={message.content ?? "Attachment"}
          className="max-h-80 w-full rounded-lg object-cover"
          loading="lazy"
        />
      )}
    </article>
  )
}
