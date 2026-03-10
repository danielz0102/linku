import type {
  ConversationRepository,
  NewConversation,
} from "#messages/application/ports/conversation-repository.d.js"
import { Conversation } from "#messages/domain/conversation.js"
import db from "#shared/db/drizzle/index.js"
import { conversationsTable } from "#shared/db/drizzle/schemas.js"
import { eq, or, and } from "drizzle-orm"

export class DrizzleConversationRepository implements ConversationRepository {
  async create(newConversation: NewConversation): Promise<Conversation> {
    return db
      .insert(conversationsTable)
      .values(newConversation)
      .returning()
      .then(([c]) => new Conversation(c))
  }

  async findByParticipants(
    participantOneId: string,
    participantTwoId: string
  ): Promise<Conversation | undefined> {
    return db
      .select()
      .from(conversationsTable)
      .where(
        or(
          and(
            eq(conversationsTable.participantOneId, participantOneId),
            eq(conversationsTable.participantTwoId, participantTwoId)
          ),
          and(
            eq(conversationsTable.participantOneId, participantTwoId),
            eq(conversationsTable.participantTwoId, participantOneId)
          )
        )
      )
      .limit(1)
      .then(([c]) => (c ? new Conversation(c) : undefined))
  }

  async findAllByUserId(userId: string): Promise<Conversation[]> {
    return db
      .select()
      .from(conversationsTable)
      .where(
        or(
          eq(conversationsTable.participantOneId, userId),
          eq(conversationsTable.participantTwoId, userId)
        )
      )
      .then((rows) => rows.map((r) => new Conversation(r)))
  }

  async findById(id: string): Promise<Conversation | undefined> {
    return db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id))
      .limit(1)
      .then(([c]) => (c ? new Conversation(c) : undefined))
  }

  async updateLastMessageAt(
    id: string,
    lastMessageAt: Date
  ): Promise<Conversation> {
    return db
      .update(conversationsTable)
      .set({ lastMessageAt })
      .where(eq(conversationsTable.id, id))
      .returning()
      .then(([c]) => new Conversation(c))
  }
}
