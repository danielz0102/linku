import type { PublicConversation } from "#messages/domain/conversation.js"
import type { ConversationRepository } from "../ports/conversation-repository.d.js"

type Dependencies = {
  conversationRepo: ConversationRepository
}

export class GetConversationsUseCase {
  private readonly conversationRepo: ConversationRepository

  constructor({ conversationRepo }: Dependencies) {
    this.conversationRepo = conversationRepo
  }

  async execute(userId: string): Promise<PublicConversation[]> {
    const conversations = await this.conversationRepo.findAllByUserId(userId)
    return conversations.map((c) => c.toPublic())
  }
}
