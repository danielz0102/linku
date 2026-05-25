import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { chatMembers, chats, files, messages } from "#db/drizzle/schemas.ts"
import { Message } from "#modules/chats/domain/message.ts"

type SaveParams = {
  peerId: string
  message: Message
  filePublicId?: string
}

export class MessageStorage {
  private tx: NodePgDatabase | null = null

  constructor(private readonly db: NodePgDatabase) {}

  async save({ message, peerId, filePublicId }: SaveParams): Promise<void> {
    await this.db.transaction(async (tx) => {
      this.tx = tx

      if (!message.chatId) {
        message.chatId = await this.createChat(message.senderId, peerId)
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

  private async createChat(senderId: string, peerId: string) {
    if (!this.tx) {
      throw new Error("Transaction not initialized")
    }

    const chat = await this.tx
      .insert(chats)
      .values({})
      .returning({ id: chats.id })
      .then((rows) => rows[0]!)

    await this.tx.insert(chatMembers).values([
      { chatId: chat.id, userId: senderId },
      { chatId: chat.id, userId: peerId },
    ])

    return chat.id
  }
}
