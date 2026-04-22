import { twMerge } from "tailwind-merge"

import { MessageBubble, type MessageBubbleProps } from "./message-bubble"

type MessageListProps = {
  messages?: MessageBubbleProps & { id: string }[]
  className?: string
}

export function MessageList({ messages, className }: MessageListProps) {
  const isLoading = messages === undefined
  const isEmpty = messages?.length === 0

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

      {messages?.toReversed().map((m) => (
        <MessageBubble key={m.id} {...m} />
      ))}
    </div>
  )
}
