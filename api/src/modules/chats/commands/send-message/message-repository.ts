import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { chatMembers, chats, files, messages } from "#db/drizzle/schemas.ts"
import { Message } from "#modules/chats/domain/message.ts"

type SaveParams = {
  peerId: string
  message: Message
  filePublicId?: string
}

export class MessageRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async save({ message, peerId, filePublicId }: SaveParams): Promise<void> {
    await this.db.transaction(async (tx) => {
      if (!message.chatId) {
        message.chatId = await this.createChat(tx, message.senderId, peerId)
      }

      let attachmentId: string | null = null

      if (message.attachmentUrl && filePublicId) {
        attachmentId = await tx
          .insert(files)
          .values({
            publicId: filePublicId,
            publicUrl: message.attachmentUrl,
          })
          .returning({ id: files.id })
          .then((rows) => rows[0]!.id)
      }

      await tx.insert(messages).values({
        chatId: message.chatId,
        senderId: message.senderId,
        text: message.text,
        attachmentId,
      })
    })
  }

  private async createChat(db: NodePgDatabase, senderId: string, peerId: string) {
    const chat = await db
      .insert(chats)
      .values({})
      .returning({ id: chats.id })
      .then((rows) => rows[0]!)

    await db.insert(chatMembers).values([
      { chatId: chat.id, userId: senderId },
      { chatId: chat.id, userId: peerId },
    ])

    return chat.id
  }
}
