import type { Conversation } from "#messages/domain/conversation.js"

export interface ConversationRepository {
  create: (newConversation: NewConversation) => Promise<Conversation>
  findByParticipants: (
    participantOneId: string,
    participantTwoId: string
  ) => Promise<Conversation | undefined>
  findAllByUserId: (userId: string) => Promise<Conversation[]>
  findById: (id: string) => Promise<Conversation | undefined>
  updateLastMessageAt: (
    id: string,
    lastMessageAt: Date
  ) => Promise<Conversation>
}

export type NewConversation = {
  participantOneId: string
  participantTwoId: string
}
