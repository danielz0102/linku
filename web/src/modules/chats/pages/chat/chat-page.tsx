import { Navigate, useParams } from "react-router"

import { useAuthenticatedUser } from "~/modules/users/context/user-context"

import { ChatHeader } from "./components/chat-header"
import { MessageBubble } from "./components/message-bubble"
import { MessageForm } from "./components/message-form"
import { MessageList } from "./components/message-list"
import { useChatEvents } from "./hooks/use-chat-events"
import { useChatQueries } from "./hooks/use-chat-queries"

export default function ChatPage() {
  const { username } = useParams()

  if (!username) {
    throw new Error("Chat peer ID is required")
  }

  const { user } = useAuthenticatedUser()

  useChatEvents(username)

  const [messages, peer] = useChatQueries(username)

  if (peer.data === null) {
    return <Navigate to="/404" replace />
  }

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {peer.data && <ChatHeader user={peer.data} />}

      <MessageList className="flex-1">
        {messages.data?.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            attachmentUrl={m.attachmentUrl}
            belongsToUser={m.senderId === user.id}
          />
        ))}
      </MessageList>

      <div className="flex items-center justify-center *:w-full *:max-w-3xl">
        {!messages.isLoading && (
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
