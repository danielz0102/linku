import { API_URL } from "~/env"

import { ChatMember } from "../../domain/chat-member"
import { Message } from "../../domain/message"

type ChatData = {
  id: string
  members: [ChatMember, ChatMember]
  lastMessage: Message
}

type APIResponse = {
  id: string
  members: [
    {
      id: string
      username: string
      firstName: string
      lastName: string
      profilePictureUrl: string | null
      lastReadAt: string | null
    },
    {
      id: string
      username: string
      firstName: string
      lastName: string
      profilePictureUrl: string | null
      lastReadAt: string | null
    },
  ]
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

  return chats.map((chat) => ({
    id: chat.id,
    members: [
      ChatMember.create({
        id: chat.members[0].id,
        username: chat.members[0].username,
        firstName: chat.members[0].firstName,
        lastName: chat.members[0].lastName,
        profilePicURL: chat.members[0].profilePictureUrl,
        lastReadAt: chat.members[0].lastReadAt,
      }),
      ChatMember.create({
        id: chat.members[1].id,
        username: chat.members[1].username,
        firstName: chat.members[1].firstName,
        lastName: chat.members[1].lastName,
        profilePicURL: chat.members[1].profilePictureUrl,
        lastReadAt: chat.members[1].lastReadAt,
      }),
    ],
    lastMessage: Message.create({
      id: chat.lastMessage.id,
      senderId: chat.lastMessage.senderId,
      text: chat.lastMessage.text,
      attachmentURL: chat.lastMessage.attachmentUrl,
      createdAt: chat.lastMessage.createdAt,
    }),
  }))
}
