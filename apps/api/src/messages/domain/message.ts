type MessageParams = {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: Date
}

export type PublicMessage = {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export class Message {
  public readonly id: string
  public readonly conversationId: string
  public readonly senderId: string
  public readonly content: string
  public readonly createdAt: Date

  constructor(params: MessageParams) {
    this.id = params.id
    this.conversationId = params.conversationId
    this.senderId = params.senderId
    this.content = params.content
    this.createdAt = params.createdAt
  }

  toPublic(): PublicMessage {
    return {
      id: this.id,
      conversationId: this.conversationId,
      senderId: this.senderId,
      content: this.content,
      createdAt: this.createdAt.toISOString(),
    }
  }
}
