import { Chat } from "../../domain/chat"
import { ChatMember } from "../../domain/chat-member"
import { Message } from "../../domain/message"

export async function getChats(): Promise<Chat[]> {
  return [
    Chat.create({
      id: "1",
      sender: ChatMember.create({ id: "1", name: "John Doe", profilePictureUrl: null }),
      lastMessage: Message.create({
        id: "1",
        content: "Hey, how are you?",
        createdAt: new Date(),
        isRead: false,
      }),
    }),
    Chat.create({
      id: "2",
      sender: ChatMember.create({
        id: "2",
        name: "ThisIsA VeryLongNameToTestTruncation",
        profilePictureUrl: "https://cataas.com/cat",
      }),
      lastMessage: Message.create({
        id: "2",
        content: "Can we sync up this afternoon?",
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
        isRead: true,
      }),
    }),
    Chat.create({
      id: "3",
      sender: ChatMember.create({
        id: "3",
        name: "Liam Brown",
        profilePictureUrl: "https://cataas.com/cat",
      }),
      lastMessage: Message.create({
        id: "3",
        content: new URL("https://example.com/attachment.pdf"),
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
        isRead: false,
      }),
    }),
    Chat.create({
      id: "4",
      sender: ChatMember.create({
        id: "4",
        name: "Olivia Martinez",
        profilePictureUrl: null,
      }),
      lastMessage: Message.create({
        id: "4",
        content: "Thanks for the update!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true,
      }),
    }),
    Chat.create({
      id: "5",
      sender: ChatMember.create({
        id: "5",
        name: "Noah Davis",
        profilePictureUrl: null,
      }),
      lastMessage: Message.create({
        id: "5",
        content:
          "This is a super big message to test the preview functionality. It should be truncated in the chat list view. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isRead: false,
      }),
    }),
    Chat.create({
      id: "6",
      sender: ChatMember.create({
        id: "6",
        name: "Sophia Lee",
        profilePictureUrl: "https://cataas.com/cat",
      }),
      lastMessage: Message.create({
        id: "6",
        content: new URL("https://example.com/image.png"),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
        isRead: true,
      }),
    }),
  ]
}
