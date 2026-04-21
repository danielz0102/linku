import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"

import { ChatHeader } from "./components/chat-header"
import { MessageBubble } from "./components/message-bubble"
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

  const isEmpty = !isLoading && chat?.messages.length === 0
  const peer = chat?.peer
  const messages = chat?.messages || []

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {peer && <ChatHeader member={peer} />}

      <div
        className={`flex flex-1 flex-col-reverse gap-2 overflow-y-auto p-4 ${(isLoading || isEmpty) && "grid place-items-center"}`}
      >
        {isLoading && <p className="text-muted m-auto animate-pulse">Loading chat...</p>}
        {isEmpty && <p className="text-muted m-auto">No messages yet. Say hi 👋</p>}

        {peer &&
          messages.reverse().map((m) => <MessageBubble key={m.id} message={m} peerId={peer.id} />)}
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
