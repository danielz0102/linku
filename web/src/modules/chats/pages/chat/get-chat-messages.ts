import { API_URL } from "~/env"

import { Message } from "../../domain/message"

type GetMessagesQuery = {
  peerUsername: string
  pageSize?: number
  olderThan?: Date
}

type APIResponse = {
  chatId?: string | undefined
  messages: {
    id: string
    senderId: string
    content: string | null
    attachmentUrl: string | null
    createdAt: string
    isRead: boolean
  }[]
  hasMore: boolean
}

export async function getMessages({
  peerUsername,
  pageSize = 20,
  olderThan,
}: GetMessagesQuery): Promise<Message[]> {
  const endpointURL = new URL(`${API_URL}/chats/${peerUsername}/messages`)

  endpointURL.searchParams.set("page_size", pageSize.toString())

  if (olderThan) {
    endpointURL.searchParams.set("older_than", olderThan.toISOString())
  }

  const res = await fetch(endpointURL, { credentials: "include" })

  if (!res.ok) {
    throw new Error("Failed to fetch messages", { cause: res.status })
  }

  const data = (await res.json()) as APIResponse

  return data.messages.map((msg) => {
    return Message.create({
      id: msg.id,
      senderId: msg.senderId,
      text: msg.content,
      attachmentURL: msg.attachmentUrl,
      createdAt: msg.createdAt,
      isRead: msg.isRead,
    })
  })
}
