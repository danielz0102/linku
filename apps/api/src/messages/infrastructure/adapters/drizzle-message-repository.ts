import type {
  FindOptions,
  MessageRepository,
  NewMessage,
} from "#messages/application/ports/message-repository.d.js"
import { Message } from "#messages/domain/message.js"
import db from "#shared/db/drizzle/index.js"
import { messagesTable } from "#shared/db/drizzle/schemas.js"
import { eq, asc } from "drizzle-orm"

export class DrizzleMessageRepository implements MessageRepository {
  async create(newMessage: NewMessage): Promise<Message> {
    return db
      .insert(messagesTable)
      .values(newMessage)
      .returning()
      .then(([m]) => new Message(m))
  }

  async findByConversation(
    conversationId: string,
    { limit = 50, offset = 0 }: FindOptions = {}
  ): Promise<Message[]> {
    return db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, conversationId))
      .orderBy(asc(messagesTable.createdAt))
      .limit(limit)
      .offset(offset)
      .then((rows) => rows.map((r) => new Message(r)))
  }
}
