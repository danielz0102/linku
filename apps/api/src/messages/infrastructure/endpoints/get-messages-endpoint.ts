import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { DrizzleConversationRepository } from "#messages/infrastructure/adapters/drizzle-conversation-repository.js"
import { DrizzleMessageRepository } from "#messages/infrastructure/adapters/drizzle-message-repository.js"
import { getMessagesHandler } from "#messages/infrastructure/handlers/get-messages-handler.js"
import { GetMessagesUseCase } from "#messages/application/use-cases/get-messages-use-case.js"
import { queryValidator } from "#shared/middlewares/query-validator.js"
import { getMessagesSchema } from "#messages/infrastructure/schemas/get-messages-schema.js"

const useCase = new GetMessagesUseCase({
  conversationRepo: new DrizzleConversationRepository(),
  messageRepo: new DrizzleMessageRepository(),
})

export const getMessagesEndpoint = [
  onlyAuth,
  queryValidator(getMessagesSchema),
  getMessagesHandler(useCase),
]
