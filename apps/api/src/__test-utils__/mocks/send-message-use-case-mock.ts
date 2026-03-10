import { SendMessageUseCase } from "~/messages/application/use-cases/send-message-use-case.ts"
import type { ConversationRepository } from "~/messages/application/ports/conversation-repository.js"
import type { MessageRepository } from "~/messages/application/ports/message-repository.js"

export class SendMessageUseCaseMock extends SendMessageUseCase {
  constructor() {
    super({
      conversationRepo: {} as ConversationRepository,
      messageRepo: {} as MessageRepository,
    })
  }

  override execute = vi.fn<SendMessageUseCase["execute"]>()
}
