import { API_URL } from "~/env"

import { ChatMember } from "../../domain/chat-member"
import { Message } from "../../domain/message"

type ChatData = {
  id: string
  peer: ChatMember
  lastMessage: Message
  hasUnreads: boolean
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
  lastReadAt: string | null
  lastMessage: {
    id: string
    senderId: string
    text: string | null
    attachmentUrl: string | null
    createdAt: string
  }
}[]

export async function getChats(): Promise<ChatData[]> {
  const res = await fetch(`${API_URL}/chats`, { credentials: "include" })

  if (!res.ok) {
    throw new Error("Failed to fetch chats", { cause: res.status })
  }

  const chats = (await res.json()) as APIResponse

  return chats.map((chat) => {
    const messageSentAt = new Date(chat.lastMessage.createdAt).getTime()
    const lastReadAt = chat.lastReadAt ? new Date(chat.lastReadAt).getTime() : null
    const hasUnreads =
      chat.lastMessage.senderId === chat.peer.id &&
      (lastReadAt === null || messageSentAt > lastReadAt)

    return {
      id: chat.id,
      peer: ChatMember.create({
        id: chat.peer.id,
        username: chat.peer.username,
        firstName: chat.peer.firstName,
        lastName: chat.peer.lastName,
        profilePicURL: chat.peer.profilePictureUrl,
      }),
      hasUnreads,
      lastMessage: Message.create({
        id: chat.lastMessage.id,
        senderId: chat.lastMessage.senderId,
        text: chat.lastMessage.text,
        attachmentURL: chat.lastMessage.attachmentUrl,
        createdAt: chat.lastMessage.createdAt,
      }),
    }
  })
}
