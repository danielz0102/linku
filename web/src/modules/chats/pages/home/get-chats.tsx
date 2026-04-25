import { API_URL } from "~/env"

import { Chat } from "../../domain/chat"
import { ChatMember } from "../../domain/chat-member"
import { Message } from "../../domain/message"
import type { GetChatsAPI } from "./get-chats-api-types"

export async function getChats(): Promise<Chat[]> {
  const res = await fetch(`${API_URL}/chats`, { credentials: "include" })

  if (!res.ok) {
    throw new Error("Failed to fetch chats")
  }

  const chatsData = (await res.json()) as GetChatsAPI.Chat[]
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
        attachmentUrl: chat.lastMessage.attachmentUrl
          ? new URL(chat.lastMessage.attachmentUrl)
          : undefined,
        createdAt: new Date(chat.lastMessage.createdAt),
        isRead: chat.lastMessage.isRead,
      }),
    })
  })

  return chats
}
