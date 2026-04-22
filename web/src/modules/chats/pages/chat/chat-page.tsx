import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"

import { ChatHeader } from "./components/chat-header"
import { MessageBubble } from "./components/message-bubble"
import { MessageForm } from "./components/message-form"
import { MessageList } from "./components/message-list"
import { getChat } from "./get-chat"

export default function ChatPage() {
  const { username } = useParams()

  if (!username) {
    throw new Error("Chat username is required")
  }

  const { data: chat, isLoading } = useQuery({
    queryKey: ["chat", username],
    queryFn: () => getChat(username),
  })

  if (!isLoading && !chat?.peer) {
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
            isLeft={m.senderId === chat.peer?.id}
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
