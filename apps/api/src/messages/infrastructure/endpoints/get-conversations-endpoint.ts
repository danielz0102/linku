import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { DrizzleConversationRepository } from "#messages/infrastructure/adapters/drizzle-conversation-repository.js"
import { getConversationsHandler } from "#messages/infrastructure/handlers/get-conversations-handler.js"
import { GetConversationsUseCase } from "#messages/application/use-cases/get-conversations-use-case.js"

const useCase = new GetConversationsUseCase({
  conversationRepo: new DrizzleConversationRepository(),
})

export const getConversationsEndpoint = [
  onlyAuth,
  getConversationsHandler(useCase),
]
