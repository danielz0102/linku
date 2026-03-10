export type Message = {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export type Conversation = {
  id: string
  participantOneId: string
  participantTwoId: string
  lastMessageAt: string
  createdAt: string
}
