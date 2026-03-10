import type { Message } from "#messages/domain/message.js"

export interface MessageRepository {
  create: (newMessage: NewMessage) => Promise<Message>
  findByConversation: (
    conversationId: string,
    options?: FindOptions
  ) => Promise<Message[]>
}

export type NewMessage = {
  conversationId: string
  senderId: string
  content: string
}

export type FindOptions = {
  limit?: number
  offset?: number
}
