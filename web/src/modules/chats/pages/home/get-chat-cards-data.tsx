import type { ChatMember } from "../../domain/chat-member"
import type { MessageData } from "../../domain/message"

type ChatCardData = {
  lastMessage: MessageData
  peer: ChatMember
}

export async function getChatCardsData(): Promise<ChatCardData[]> {
  return []
}
