import { useQueries } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"

import { useAuthenticatedUser } from "~/modules/users/context/user-context"

import { getInitials } from "../../domain/chat-member"
import { ChatHeader } from "./components/chat-header"
import { MessageBubble } from "./components/message-bubble"
import { MessageForm } from "./components/message-form"
import { MessageList } from "./components/message-list"
import { getChatMember } from "./get-chat-member"
import { getMessages } from "./get-chat-messages"
import { useChatEvents } from "./hooks/use-chat-events"

export default function ChatPage() {
  const { username } = useParams()

  if (!username) {
    throw new Error("Chat peer ID is required")
  }

  const { user } = useAuthenticatedUser()

  useChatEvents(username)

  const [messages, peer] = useQueries({
    queries: [
      {
        queryKey: ["messages", username],
        queryFn: () => getMessages(username),
        throwOnError: true,
      },
      {
        queryKey: ["chat-member", username],
        queryFn: () => getChatMember(username),
        throwOnError: true,
      },
    ],
  })

  if (peer.data === null) {
    return <Navigate to="/404" replace />
  }

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {peer.data && (
        <ChatHeader
          username={peer.data.username}
          name={peer.data.name}
          initials={getInitials(peer.data.name)}
          avatarUrl={peer.data.profilePicURL ?? undefined}
        />
      )}

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
