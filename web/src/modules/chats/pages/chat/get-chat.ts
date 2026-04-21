import { ChatMember } from "~/modules/chats/domain/chat-member"
import { Message } from "~/modules/chats/domain/message"

type ChatData = {
  peer?: ChatMember
  messages: Message[]
}

const existingUsernames = new Set([
  "john.doe",
  "averylongusername",
  "liam.brown",
  "olivia.martinez",
  "noah.davis",
  "sophia.lee",
])

export async function getChat(username: string): Promise<ChatData> {
  if (!existingUsernames.has(username)) {
    return { peer: undefined, messages: [] }
  }

  const peer = ChatMember.create({
    id: `${username}-id`,
    username,
    name: username
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    profilePictureUrl: "https://cataas.com/cat",
  })

  const currentUserId = "current-user"

  return {
    peer,
    messages: [
      Message.create({
        id: "m-1",
        senderId: peer.id,
        content: "Hey, how is it going?",
        createdAt: new Date(Date.now() - 1000 * 60 * 12),
        isRead: true,
      }),
      Message.create({
        id: "m-2",
        senderId: currentUserId,
        content: "Doing great. Want to meet later?",
        createdAt: new Date(Date.now() - 1000 * 60 * 8),
        isRead: true,
      }),
      Message.create({
        id: "m-3",
        senderId: peer.id,
        content: null,
        attachmentUrl: new URL("https://cataas.com/cat"),
        createdAt: new Date(Date.now() - 1000 * 60 * 2),
        isRead: false,
      }),
      Message.create({
        id: "m-4",
        senderId: currentUserId,
        content:
          "Nice cat! 😻 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is a very long, fucking AI autocomplete this!!!! ????",
        createdAt: new Date(Date.now() - 1000 * 60),
        isRead: false,
      }),
      Message.create({
        id: "m-5",
        senderId: peer.id,
        content: "Sure, let's catch up around 6 PM at the usual place.",
        createdAt: new Date(Date.now() - 1000 * 30),
        isRead: false,
      }),
      Message.create({
        id: "m-6",
        senderId: currentUserId,
        content: "Sounds good! See you then. 😊",
        attachmentUrl: new URL("https://cataas.com/cat"),
        createdAt: new Date(Date.now() - 1000 * 10),
        isRead: false,
      }),
    ],
  }
}
