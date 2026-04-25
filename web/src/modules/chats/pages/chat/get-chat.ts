import { API_URL } from "~/env"
import { ChatMember } from "~/modules/chats/domain/chat-member"
import { Message } from "~/modules/chats/domain/message"

import type { ChatAPI } from "../../api/chat-api"

type GetChatAPIResponse = {
  chatId: string
  peer: ChatAPI.ChatMember
  messages: ChatAPI.Message[]
  hasMore: boolean
}

type GetChatResult = {
  id: string
  peer: ChatMember
  messages: Message[]
  hasMore: boolean
} | null

export async function getChat(peerId: string): Promise<GetChatResult> {
  const res = await fetch(`${API_URL}/chats/${peerId}`, { credentials: "include" })

  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch chat: ${res.statusText}`)
  }

  const data = (await res.json()) as GetChatAPIResponse
  const peer = ChatMember.create({
    id: data.peer.id,
    username: data.peer.username,
    name: data.peer.name,
    profilePictureUrl: data.peer.profilePictureUrl,
  })
  const messages = data.messages.map((msg) => {
    return Message.create({
      id: msg.id,
      senderId: msg.senderId,
      content: msg.content,
      attachmentUrl: msg.attachmentUrl ?? undefined,
      createdAt: msg.createdAt,
      isRead: msg.isRead,
    })
  })

  return { id: data.chatId, peer, messages, hasMore: data.hasMore }
}
