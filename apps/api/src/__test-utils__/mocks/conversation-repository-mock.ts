import type { ConversationRepository } from "~/messages/application/ports/conversation-repository.js"

export class ConversationRepositoryMock implements ConversationRepository {
  create = vi.fn<ConversationRepository["create"]>()
  findByParticipants = vi.fn<ConversationRepository["findByParticipants"]>()
  findAllByUserId = vi.fn<ConversationRepository["findAllByUserId"]>()
  findById = vi.fn<ConversationRepository["findById"]>()
  updateLastMessageAt = vi.fn<ConversationRepository["updateLastMessageAt"]>()
}
