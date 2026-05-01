import { API_URL } from "~/env"

import { ChatMember } from "../../domain/chat-member"
import { Message } from "../../domain/message"

type ChatData = {
  id: string
  peer: ChatMember
  lastMessage: Message
}

type APIResponse = {
  id: string
  peer: {
    id: string
    username: string
    firstName: string
    lastName: string
    profilePictureUrl: string | null
  }
  lastMessage: {
    id: string
    senderId: string
    content: string | null
    attachmentUrl: string | null
    createdAt: string
    isRead: boolean
  }
}[]

export async function getChats(): Promise<ChatData[]> {
  const res = await fetch(`${API_URL}/chats`, { credentials: "include" })

  if (!res.ok) {
    throw new Error("Failed to fetch chats", { cause: res.status })
  }

  const chats = (await res.json()) as APIResponse

  return chats.map((chat) => ({
    id: chat.id,
    peer: ChatMember.create({
      id: chat.peer.id,
      username: chat.peer.username,
      firstName: chat.peer.firstName,
      lastName: chat.peer.lastName,
    }),
    lastMessage: Message.create({
      id: chat.lastMessage.id,
      senderId: chat.lastMessage.senderId,
      text: chat.lastMessage.content,
      attachmentURL: chat.lastMessage.attachmentUrl,
      createdAt: chat.lastMessage.createdAt,
      isRead: chat.lastMessage.isRead,
    }),
  }))
}
