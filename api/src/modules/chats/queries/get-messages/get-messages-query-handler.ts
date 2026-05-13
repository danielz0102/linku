import { and, desc, eq, lt } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, users } from "#db/drizzle/schemas.ts"
import { messagesView } from "#db/drizzle/views.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"

type GetMessagesQuery = {
  userId: string
  peerUsername: string
  before?: Date
  limit?: number
}

type MessagesData = {
  chatId?: string
  messages: MessageData[]
  hasMore: boolean
}

export class GetMessagesQueryHandler {
  constructor(private db: NodePgDatabase) {}

  async execute(query: GetMessagesQuery): Promise<MessagesData> {
    const { userId, peerUsername, before, limit = 20 } = query

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
        id: messagesView.id,
        chatId: messagesView.chatId,
        senderId: messagesView.senderId,
        text: messagesView.text,
        attachmentUrl: messagesView.attachmentUrl,
        createdAt: messagesView.createdAt,
      })
      .from(messagesView)
      .innerJoin(self, and(eq(self.chatId, messagesView.chatId), eq(self.userId, userId)))
      .innerJoin(peer, and(eq(peer.chatId, messagesView.chatId), eq(peer.userId, peerUser.id)))
      .where(before ? lt(messagesView.createdAt, before) : undefined)
      .orderBy(desc(messagesView.createdAt))
      .limit(limit + 1)

    const selectedMessages = data.slice(0, limit).reverse()

    return {
      chatId: selectedMessages[0]?.chatId,
      messages: selectedMessages.map((msg) => ({
        id: msg.id,
        chatId: msg.chatId,
        senderId: msg.senderId,
        text: msg.text,
        attachmentUrl: msg.attachmentUrl,
        createdAt: msg.createdAt.toISOString(),
      })),
      hasMore: data.length > limit,
    }
  }
}
