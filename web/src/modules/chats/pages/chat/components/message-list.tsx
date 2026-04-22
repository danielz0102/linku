import { twMerge } from "tailwind-merge"

import type { Message } from "~/modules/chats/domain/message"

import { MessageBubble } from "./message-bubble"

type MessageListProps = {
  data?: {
    peerId: string
    messages: Message[]
  }
  className?: string
}

export function MessageList({ data, className }: MessageListProps) {
  const isLoading = data === undefined
  const isEmpty = data?.messages.length === 0

  return (
    <div
      className={twMerge(
        "flex flex-col-reverse gap-2 overflow-y-auto p-4",
        (isLoading || isEmpty) && "grid place-items-center",
        className
      )}
    >
      <p role="status" className={`text-muted m-auto ${isLoading && "animate-pulse"}`}>
        {isLoading && "Loading chat..."}
        {isEmpty && "No messages yet. Say hi 👋"}
      </p>

      {data?.messages.toReversed().map((m) => (
        <MessageBubble
          key={m.id}
          text={m.content ?? undefined}
          attachmentUrl={m.attachmentUrl?.href}
          isLeft={m.senderId === data?.peerId}
        />
      ))}
    </div>
  )
}
