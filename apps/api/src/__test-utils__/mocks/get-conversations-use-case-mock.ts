import { GetConversationsUseCase } from "~/messages/application/use-cases/get-conversations-use-case.ts"
import type { ConversationRepository } from "~/messages/application/ports/conversation-repository.js"

export class GetConversationsUseCaseMock extends GetConversationsUseCase {
  constructor() {
    super({
      conversationRepo: {} as ConversationRepository,
    })
  }

  override execute = vi.fn<GetConversationsUseCase["execute"]>()
}
