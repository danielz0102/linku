import { GetMessagesUseCase } from "~/messages/application/use-cases/get-messages-use-case.ts"
import type { ConversationRepository } from "~/messages/application/ports/conversation-repository.js"
import type { MessageRepository } from "~/messages/application/ports/message-repository.js"

export class GetMessagesUseCaseMock extends GetMessagesUseCase {
  constructor() {
    super({
      conversationRepo: {} as ConversationRepository,
      messageRepo: {} as MessageRepository,
    })
  }

  override execute = vi.fn<GetMessagesUseCase["execute"]>()
}
