import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"

import { useAuthenticatedUser } from "~/modules/users/context/user-context"

import { Message } from "../../domain/message"
import { getChatMember } from "./api/get-chat-member"
import { getMessages } from "./api/get-chat-messages"
import { uploadAttachment } from "./api/upload-attachment"
import { ChatHeader } from "./components/chat-header"
import { MessageBubble } from "./components/message-bubble"
import { MessageForm, type MessageFormData } from "./components/message-form"
import { MessageList } from "./components/message-list"
import { useChatEvents } from "./hooks/use-chat-events"
import { useMessages } from "./hooks/use-messages"

export default function ChatPage() {
  const { username } = useParams()

  if (!username) {
    throw new Error("Chat peer ID is required")
  }

  const { user } = useAuthenticatedUser()

  const initialMessages = useInfiniteQuery({
    queryKey: ["messages", username],
    initialPageParam: undefined as Date | undefined,
    queryFn: ({ pageParam }) => {
      return getMessages({ peerUsername: username, before: pageParam })
    },
    getNextPageParam: () => undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
    refetchOnWindowFocus: false,
  })

  const peer = useQuery({
    queryKey: ["chat-member", username],
    queryFn: () => getChatMember(username),
    throwOnError: true,
    refetchOnWindowFocus: false,
  })

  const { messages, addMessage } = useMessages(
    initialMessages.data?.pages.flatMap((p) => p.messages) ?? []
  )
  const { sendMessage } = useChatEvents(username, {
    onNewMessage: (msg) => addMessage(msg),
  })

  if (peer.data === null) {
    return <Navigate to="/404" replace />
  }

  const handleSubmit = async (data: MessageFormData) => {
    const newMessage = Message.createTemporal({
      text: data.message,
      file: data.file,
      senderId: user.id,
    })

    addMessage(newMessage)

    if (data.file) {
      const { url, public_id } = await uploadAttachment(data.file)

      sendMessage({
        text: data.message,
        attachment: { url, public_id },
      })
    } else {
      sendMessage({ text: data.message })
    }
  }

  return (
    <main className="flex size-full flex-col overflow-y-auto">
      {peer.data && <ChatHeader user={peer.data} />}

      <MessageList
        className="flex-1"
        state={initialMessages.isLoading ? "loading" : messages.length === 0 ? "empty" : "filled"}
        onEndReached={async () => {
          if (!initialMessages.isFetching && initialMessages.hasPreviousPage) {
            await initialMessages.fetchPreviousPage()
          }
        }}
      >
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            attachmentUrl={m.attachmentUrl}
            belongsToUser={m.senderId === user.id}
          />
        ))}
      </MessageList>

      <div className="flex items-center justify-center *:w-full *:max-w-3xl">
        {!initialMessages.isLoading && <MessageForm onSubmit={handleSubmit} />}
      </div>
    </main>
  )
}
