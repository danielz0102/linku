import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Navigate, useParams } from "react-router"

import { ChatHeader } from "./components/chat-header"
import { Message } from "./components/message"
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
  const orderedMessages = useMemo(() => [...(chat?.messages ?? [])].reverse(), [chat?.messages])

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {peer && <ChatHeader member={peer} />}

      <div
        className="flex-1 overflow-y-auto data-empty:grid data-empty:place-items-center"
        data-empty={isLoading || isEmpty || undefined}
      >
        {isLoading && <p className="text-muted m-auto animate-pulse">Loading chat...</p>}
        {isEmpty && <p className="text-muted m-auto">No messages yet. Say hi 👋</p>}
        {!isLoading && peer && !isEmpty && (
          <div className="flex min-h-full flex-col-reverse gap-2 p-4">
            {orderedMessages.map((message) => (
              <Message key={message.id} message={message} peerId={peer.id} />
            ))}
          </div>
        )}
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
