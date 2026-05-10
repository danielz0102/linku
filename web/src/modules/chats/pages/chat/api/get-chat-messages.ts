import { API_URL } from "~/env"
import type { MessageAPIData } from "~/modules/chats/api/message-api-data"

import { Message } from "../../../domain/message"

type GetMessagesQuery = {
  peerUsername: string
  pageSize?: number
  olderThan?: Date
}

type APIResponse = {
  chatId?: string | undefined
  messages: MessageAPIData[]
  hasMore: boolean
}

type GetMessagesResult = {
  messages: Message[]
  nextCursor: Date | null
}

export async function getMessages({
  peerUsername,
  pageSize = 20,
  olderThan,
}: GetMessagesQuery): Promise<GetMessagesResult> {
  const endpointURL = new URL(`${API_URL}/chats/${peerUsername}/messages`)

  endpointURL.searchParams.set("page_size", pageSize.toString())

  if (olderThan) {
    endpointURL.searchParams.set("cursor", olderThan.toISOString())
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
  const lastMessage = data.messages.at(-1)
  const nextCursor = lastMessage ? new Date(lastMessage.createdAt) : null

  return { messages, nextCursor }
}
