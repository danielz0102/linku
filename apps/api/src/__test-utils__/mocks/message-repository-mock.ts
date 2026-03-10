import type { MessageRepository } from "~/messages/application/ports/message-repository.js"

export class MessageRepositoryMock implements MessageRepository {
  create = vi.fn<MessageRepository["create"]>()
  findByConversation = vi.fn<MessageRepository["findByConversation"]>()
}
