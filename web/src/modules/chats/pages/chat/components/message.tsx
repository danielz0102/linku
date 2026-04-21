import type { Message as MessageEntity } from "~/modules/chats/domain/message"

type MessageProps = {
  message: MessageEntity
  peerId: string
}

export function Message({ message, peerId }: MessageProps) {
  const isPeerMessage = message.senderId === peerId
  const canRenderAttachment = message.attachmentUrl && message.attachmentUrl.protocol === "https:"

  return (
    <article
      className={`flex max-w-[85%] flex-col gap-2 rounded-2xl p-3 wrap-break-word ${
        isPeerMessage
          ? "self-start rounded-bl-sm bg-blue-100"
          : "self-end rounded-br-sm bg-blue-300 text-black"
      }`}
    >
      {canRenderAttachment && (
        <img
          src={message.attachmentUrl.href}
          alt="Attachment preview"
          className="max-h-80 w-full rounded-lg object-cover"
          loading="lazy"
        />
      )}
      {message.content && <p>{message.content}</p>}
    </article>
  )
}
