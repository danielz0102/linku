type ConversationParams = {
  id: string
  participantOneId: string
  participantTwoId: string
  lastMessageAt: Date
  createdAt: Date
}

export type PublicConversation = {
  id: string
  participantOneId: string
  participantTwoId: string
  lastMessageAt: string
  createdAt: string
}

export class Conversation {
  public readonly id: string
  public readonly participantOneId: string
  public readonly participantTwoId: string
  public readonly lastMessageAt: Date
  public readonly createdAt: Date

  constructor(params: ConversationParams) {
    this.id = params.id
    this.participantOneId = params.participantOneId
    this.participantTwoId = params.participantTwoId
    this.lastMessageAt = params.lastMessageAt
    this.createdAt = params.createdAt
  }

  hasParticipant(userId: string): boolean {
    return (
      this.participantOneId === userId || this.participantTwoId === userId
    )
  }

  toPublic(): PublicConversation {
    return {
      id: this.id,
      participantOneId: this.participantOneId,
      participantTwoId: this.participantTwoId,
      lastMessageAt: this.lastMessageAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
    }
  }
}
