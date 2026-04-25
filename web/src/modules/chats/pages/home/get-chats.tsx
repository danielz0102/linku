import { API_URL } from "~/env"

import type { ChatAPI } from "../../api/chat-api"
import { Chat } from "../../domain/chat"
import { ChatMember } from "../../domain/chat-member"
import { Message } from "../../domain/message"

type GetChatsResponse = {
  id: string
  peer: ChatAPI.ChatMember
  lastMessage: ChatAPI.Message
}[]

export async function getChats(): Promise<Chat[]> {
  const res = await fetch(`${API_URL}/chats`, { credentials: "include" })

  if (!res.ok) {
    throw new Error("Failed to fetch chats")
  }

  const chatsData = (await res.json()) as GetChatsResponse
  const chats = chatsData.map((chat) => {
    return Chat.create({
      id: chat.id,
      peer: ChatMember.create({
        id: chat.peer.id,
        username: chat.peer.username,
        name: chat.peer.name,
        profilePictureUrl: chat.peer.profilePictureUrl,
      }),
      lastMessage: Message.create({
        id: chat.lastMessage.id,
        senderId: chat.lastMessage.senderId,
        content: chat.lastMessage.content,
        attachmentUrl: chat.lastMessage.attachmentUrl ?? undefined,
        createdAt: chat.lastMessage.createdAt,
        isRead: chat.lastMessage.isRead,
      }),
    })
  })

  return chats
}
