import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"

import { ChatHeader } from "./chat-header"
import { getChat } from "./get-chat"
import { MessageForm } from "./message-form"

export default function ChatPage() {
  const { username } = useParams()

  if (!username) {
    throw new Error("Chat username is required")
  }

  const { data: chat, isLoading } = useQuery({
    queryKey: ["chat", username],
    queryFn: () => getChat(username),
  })

  if (!isLoading && !chat) {
    return <Navigate to="/404" replace />
  }

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {chat && <ChatHeader member={chat.peer} />}

      {isLoading && <p className="text-muted m-auto animate-pulse">Loading chat...</p>}

      <div className="flex-1"></div>

      <div className="flex items-center justify-center *:w-full *:max-w-3xl">
        {chat && (
          <MessageForm
            onSend={(message) => {
              console.log("Send message:", message)
            }}
            onAttachClick={(context) => {
              console.log({ context })
            }}
          />
        )}
      </div>
    </main>
  )
}
