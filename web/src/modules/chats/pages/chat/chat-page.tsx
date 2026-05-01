import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Navigate, useParams } from "react-router"

import { useAuthenticatedUser } from "~/modules/users/context/user-context"

import { ChatHeader } from "./components/chat-header"
import { MessageBubble } from "./components/message-bubble"
import { MessageForm } from "./components/message-form"
import { MessageList } from "./components/message-list"
import { getChat } from "./get-chat"
import { socket } from "./socket"

export default function ChatPage() {
  const { user } = useAuthenticatedUser()
  const { peerId } = useParams()

  if (!peerId) {
    throw new Error("Chat peer ID is required")
  }

  const { data: chat, isLoading } = useQuery({
    queryKey: ["chat", peerId],
    queryFn: () => getChat(peerId),
    throwOnError: true,
  })

  useEffect(() => {
    socket.emit("join_chat", { peerId })
  }, [peerId])

  if (!isLoading && chat === null) {
    return <Navigate to="/404" replace />
  }

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {chat?.peer && <ChatHeader member={chat.peer} />}

      <MessageList className="flex-1">
        {chat?.messages.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.content ?? undefined}
            attachmentUrl={m.attachmentUrl?.href}
            belongsToUser={m.senderId === user.id}
          />
        ))}
      </MessageList>

      <div className="flex items-center justify-center *:w-full *:max-w-3xl">
        {!isLoading && (
          <MessageForm
            onSubmit={(data) => {
              console.log({ data })
            }}
          />
        )}
      </div>
    </main>
  )
}
