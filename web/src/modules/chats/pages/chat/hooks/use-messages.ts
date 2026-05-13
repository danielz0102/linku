import { useState } from "react"

import type { Message } from "~/modules/chats/domain/message"

export function useMessages(initialMessages: Message[] = []) {
  const [entryMessages, setEntryMessages] = useState<Message[]>([])

  const addMessage = (message: Message) => {
    setEntryMessages((prev) => [message, ...prev])
  }

  return { messages: [...initialMessages, ...entryMessages], addMessage }
}
