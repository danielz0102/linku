import { useEffect, useRef } from "react"
import { twMerge } from "tailwind-merge"

import { MessageBubble } from "./message-bubble"

type MessageListProps = {
  onEndReached: () => void
  state: "empty" | "loading" | "filled"
  messages: {
    id: string
    text: string | null
    attachmentUrl?: string | null
    belongsToUser: boolean
  }[]
  className?: string
}

export function MessageList({ state, className, messages, onEndReached }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const firstMessageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (state !== "filled" || !containerRef.current || !firstMessageRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (entry.target.id === firstMessageRef.current?.id) {
            onEndReached()
          }
        }
      },
      {
        root: containerRef.current,
        threshold: 0.1,
      }
    )

    observer.observe(firstMessageRef.current)

    return () => observer.disconnect()
  }, [onEndReached, state])

  useEffect(() => {
    if (state === "filled" && containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight })
    }
  }, [state])

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "flex flex-col gap-2 overflow-y-auto p-4",
        (state === "loading" || state === "empty") && "grid place-items-center",
        className
      )}
    >
      <p role="status" className={`text-muted m-auto ${state === "loading" && "animate-pulse"}`}>
        {state === "loading" && "Loading chat..."}
        {state === "empty" && "No messages yet. Say hi 👋"}
      </p>
      {messages.map((message) => (
        <MessageBubble
          ref={message.id === messages[0]?.id ? firstMessageRef : null}
          key={message.id}
          text={message.text}
          attachmentUrl={message.attachmentUrl}
          belongsToUser={message.belongsToUser}
        />
      ))}
    </div>
  )
}
