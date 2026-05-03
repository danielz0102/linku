import { and, desc, eq, lt, sql } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, messageReads, messages, users } from "#db/drizzle/schemas.ts"
import type { Message } from "#modules/chats/domain/message.ts"

type GetMessagesQuery = {
  userId: string
  peerUsername: string
  olderThan?: Date
  quantity?: number
}

type MessagesData = {
  chatId?: string
  messages: Message[]
  hasMore: boolean
}

export class GetMessagesQueryHandler {
  constructor(private db: NodePgDatabase) {}

  async execute(query: GetMessagesQuery): Promise<MessagesData> {
    const { userId, peerUsername, olderThan, quantity = 20 } = query

    const peerUser = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, peerUsername))
      .limit(1)
      .then((res) => res[0])

    if (!peerUser) {
      return {
        messages: [],
        hasMore: false,
      }
    }

    const self = alias(chatMembers, "self")
    const peer = alias(chatMembers, "peer")

    const data = await this.db
      .select({
        id: messages.id,
        chatId: messages.chatId,
        senderId: messages.senderId,
        content: messages.content,
        attachmentUrl: messages.attachmentUrl,
        createdAt: messages.createdAt,
        isRead: sql<boolean>`${messageReads.readAt} IS NOT NULL`,
      })
      .from(messages)
      .innerJoin(self, and(eq(self.chatId, messages.chatId), eq(self.userId, userId)))
      .innerJoin(peer, and(eq(peer.chatId, messages.chatId), eq(peer.userId, peerUser.id)))
      .leftJoin(
        messageReads,
        and(eq(messageReads.messageId, messages.id), eq(messageReads.userId, userId))
      )
      .where(olderThan ? lt(messages.createdAt, olderThan) : undefined)
      .orderBy(desc(messages.createdAt))
      .limit(quantity + 1)

    const hasMore = data.length > quantity
    const messagesData = data.slice(0, quantity)

    return {
      chatId: messagesData[0]?.chatId,
      messages: messagesData.map((msg) => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        attachmentUrl: msg.attachmentUrl,
        createdAt: msg.createdAt.toISOString(),
        isRead: msg.isRead,
      })),
      hasMore,
    }
  }
}
