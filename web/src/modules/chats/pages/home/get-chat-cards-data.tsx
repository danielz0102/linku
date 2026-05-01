import type { ChatMember } from "../../domain/chat-member"
import type { Message } from "../../domain/message"

type ChatCardData = {
  lastMessage: Message
  peer: ChatMember
}

export async function getChatCardsData(): Promise<ChatCardData[]> {
  return []
}
