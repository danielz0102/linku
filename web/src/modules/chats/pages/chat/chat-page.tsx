import { useState } from "react"
import { Navigate, useParams } from "react-router"

import { useAuthenticatedUser } from "~/modules/users/context/user-context"

import { Message } from "../../domain/message"
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
  const [entryMessages, setEntryMessages] = useState<Message[]>([])
  const [initialMessages, peer] = useChatQueries(username)

  const { sendMessage } = useChatEvents(username)

  if (peer.data === null) {
    return <Navigate to="/404" replace />
  }

  const allMessages = [initialMessages.data ?? [], entryMessages].flat()

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {peer.data && <ChatHeader user={peer.data} />}

      <MessageList className="flex-1" isLoading={initialMessages.isLoading}>
        {allMessages.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            attachmentUrl={m.attachmentUrl}
            belongsToUser={m.senderId === user.id}
          />
        ))}
      </MessageList>

      <div className="flex items-center justify-center *:w-full *:max-w-3xl">
        {!initialMessages.isLoading && (
          <MessageForm
            onSubmit={(data) => {
              const newMessage = Message.create({
                id: crypto.randomUUID(),
                text: data.message,
                attachmentURL: data.file ? URL.createObjectURL(data.file) : undefined,
                senderId: user.id,
                createdAt: new Date(),
                isRead: true,
              })

              setEntryMessages((prev) => [...prev, newMessage])
              //TODO: if has an attachment, upload to cloudinary and get the URL
              //then send the message with the attachment URL
              void sendMessage
            }}
          />
        )}
      </div>
    </main>
  )
}
