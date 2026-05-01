import type { ChatMemberData } from "../../domain/chat-member"
import type { MessageData } from "../../domain/message"

type ChatCardData = {
  lastMessage: MessageData
  peer: ChatMemberData
}

export async function getChatCardsData(): Promise<ChatCardData[]> {
  return []
}
