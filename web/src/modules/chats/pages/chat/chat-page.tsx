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

  if (!isLoading && !chat?.peer) {
    return <Navigate to="/404" replace />
  }

  const isEmpty = !isLoading && chat?.messages.length === 0

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {chat?.peer && <ChatHeader member={chat.peer} />}

      <div
        className="flex-1 data-empty:grid data-empty:place-items-center"
        data-empty={isLoading || isEmpty || undefined}
      >
        {isLoading && <p className="text-muted m-auto animate-pulse">Loading chat...</p>}
        {isEmpty && <p className="text-muted m-auto">No messages yet. Say hi 👋</p>}
      </div>

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
