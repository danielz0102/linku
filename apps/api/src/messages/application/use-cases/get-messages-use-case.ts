import { Result } from "#shared/lib/result.js"
import type { PublicMessage } from "#messages/domain/message.js"
import type { ConversationRepository } from "../ports/conversation-repository.d.js"
import type { MessageRepository } from "../ports/message-repository.d.js"

type Dependencies = {
  conversationRepo: ConversationRepository
  messageRepo: MessageRepository
}

export type GetMessagesData = {
  userId: string
  conversationId: string
  limit?: number
  offset?: number
}

export class GetMessagesUseCase {
  private readonly conversationRepo: ConversationRepository
  private readonly messageRepo: MessageRepository

  constructor({ conversationRepo, messageRepo }: Dependencies) {
    this.conversationRepo = conversationRepo
    this.messageRepo = messageRepo
  }

  async execute({
    userId,
    conversationId,
    limit,
    offset,
  }: GetMessagesData): Promise<Result<PublicMessage[], string>> {
    const conversation = await this.conversationRepo.findById(conversationId)

    if (!conversation) {
      return Result.fail("Conversation not found")
    }

    if (!conversation.hasParticipant(userId)) {
      return Result.fail("Forbidden")
    }

    const messages = await this.messageRepo.findByConversation(conversationId, {
      limit,
      offset,
    })

    return Result.ok(messages.map((m) => m.toPublic()))
  }
}
