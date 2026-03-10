import { Result } from "#shared/lib/result.js"
import type { PublicMessage } from "#messages/domain/message.js"
import type { ConversationRepository } from "../ports/conversation-repository.d.js"
import type { MessageRepository } from "../ports/message-repository.d.js"

type Dependencies = {
  conversationRepo: ConversationRepository
  messageRepo: MessageRepository
}

export type SendMessageData = {
  senderId: string
  recipientId: string
  content: string
}

export class SendMessageUseCase {
  private readonly conversationRepo: ConversationRepository
  private readonly messageRepo: MessageRepository

  constructor({ conversationRepo, messageRepo }: Dependencies) {
    this.conversationRepo = conversationRepo
    this.messageRepo = messageRepo
  }

  async execute({
    senderId,
    recipientId,
    content,
  }: SendMessageData): Promise<Result<PublicMessage, string>> {
    if (senderId === recipientId) {
      return Result.fail("Cannot send a message to yourself")
    }

    let conversation = await this.conversationRepo.findByParticipants(
      senderId,
      recipientId
    )

    if (!conversation) {
      conversation = await this.conversationRepo.create({
        participantOneId: senderId,
        participantTwoId: recipientId,
      })
    }

    const now = new Date()

    const message = await this.messageRepo.create({
      conversationId: conversation.id,
      senderId,
      content,
    })

    await this.conversationRepo.updateLastMessageAt(conversation.id, now)

    return Result.ok(message.toPublic())
  }
}
