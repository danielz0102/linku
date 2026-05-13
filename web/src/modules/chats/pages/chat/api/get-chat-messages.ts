import { API_URL } from "~/env"
import type { MessageAPIData } from "~/modules/chats/api/message-api-data"

import { Message } from "../../../domain/message"

type GetMessagesQuery = {
  peerUsername: string
  limit?: number
  before?: Date
}

type APIResponse = {
  chatId?: string | undefined
  messages: MessageAPIData[]
  hasMore: boolean
}

type GetMessagesResult = {
  messages: Message[]
  previousCursor: Date | null
}

export async function getMessages({
  peerUsername,
  limit = 20,
  before,
}: GetMessagesQuery): Promise<GetMessagesResult> {
  const endpointURL = new URL(`${API_URL}/chats/${peerUsername}/messages`)

  endpointURL.searchParams.set("limit", limit.toString())

  if (before) {
    endpointURL.searchParams.set("before", before.toISOString())
  }

  const res = await fetch(endpointURL, { credentials: "include" })

  if (!res.ok) {
    throw new Error("Failed to fetch messages", { cause: res.status })
  }

  const data = (await res.json()) as APIResponse
  const messages = data.messages.map((msg) => {
    return Message.create({
      id: msg.id,
      senderId: msg.senderId,
      text: msg.text,
      attachmentURL: msg.attachmentUrl,
      createdAt: msg.createdAt,
    })
  })

  const firstMessage = data.messages[0]
  const previousCursor = firstMessage && data.hasMore ? new Date(firstMessage.createdAt) : null

  return { messages, previousCursor }
}
