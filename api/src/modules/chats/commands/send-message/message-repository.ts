import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

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
      const chatId = await this.getChatId(tx, message.senderId, peerId)
      message.chatId = chatId

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

  private async getChatId(db: NodePgDatabase, senderId: string, peerId: string): Promise<string> {
    let chatId = await this.findChatId(db, senderId, peerId)

    if (!chatId) {
      chatId = await this.createChat(db, senderId, peerId)
    }

    return chatId
  }

  private async findChatId(
    db: NodePgDatabase,
    senderId: string,
    peerId: string
  ): Promise<string | null> {
    const selfMember = alias(chatMembers, "self_member")
    const peerMember = alias(chatMembers, "peer_member")

    const row = await db
      .select({ chatId: selfMember.chatId })
      .from(selfMember)
      .innerJoin(
        peerMember,
        and(eq(peerMember.chatId, selfMember.chatId), eq(peerMember.userId, peerId))
      )
      .where(eq(selfMember.userId, senderId))
      .limit(1)
      .then((rows) => rows[0])

    return row?.chatId ?? null
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
