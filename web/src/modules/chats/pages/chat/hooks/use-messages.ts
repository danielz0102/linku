import { useInfiniteQuery } from "@tanstack/react-query"
import { useState } from "react"

import type { Message } from "~/modules/chats/domain/message"

import { getMessages } from "../api/get-chat-messages"
import { useChatEvents } from "./use-chat-events"

export function useMessages(username: string) {
  const [entryMessages, setEntryMessages] = useState<Message[]>([])

  const messagesQuery = useInfiniteQuery({
    queryKey: ["messages", username],
    initialPageParam: undefined as Date | undefined,
    queryFn: ({ pageParam }) => {
      return getMessages({ peerUsername: username, before: pageParam })
    },
    getNextPageParam: (lastPage) => lastPage.previousCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  })

  const { sendMessage } = useChatEvents(username, {
    onNewMessage: (msg) => addMessage(msg),
  })

  const initialMessages = messagesQuery.data?.pages.flatMap((p) => p.messages) ?? []

  const addMessage = (message: Message) => {
    setEntryMessages((prev) => [...prev, message])
  }

  return {
    messages: [...initialMessages, ...entryMessages],
    addMessage,
    sendMessage,
    messagesQuery,
  }
}
