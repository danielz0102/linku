import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"

import { ChatHeader } from "./components/chat-header"
import { MessageList } from "./components/message-list"
import { MessageForm } from "./components/message-form"
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

  const peer = chat?.peer
  const messages = chat?.messages?.map((message) => ({
    text: message.content ?? undefined,
    attachmentUrl: message.attachmentUrl?.href,
    isLeft: message.senderId === peer?.id,
  }))

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {peer && <ChatHeader member={peer} />}

      <MessageList messages={isLoading ? undefined : messages} className="flex-1" />

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
