import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"

import { ChatHeader } from "./components/chat-header"
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

  const peer = chat?.peer
  const data = (() => {
    if (!chat) return
    if (!chat.peer) return

    return {
      peerId: chat.peer.id,
      messages: chat.messages,
    }
  })()

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {peer && <ChatHeader member={peer} />}

      <MessageList data={data} className="flex-1" />

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
