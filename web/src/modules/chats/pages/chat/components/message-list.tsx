import { twMerge } from "tailwind-merge"

import { MessageBubble, type MessageBubbleProps } from "./message-bubble"

type MessageListProps = {
  messages?: MessageBubbleProps[]
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
        className,
      )}
    >
      {isLoading && <p className="text-muted m-auto animate-pulse">Loading chat...</p>}
      {isEmpty && <p className="text-muted m-auto">No messages yet. Say hi 👋</p>}

      {messages
        ?.toReversed()
        .map((message, index) => <MessageBubble key={index} {...message} />)}
    </div>
  )
}
