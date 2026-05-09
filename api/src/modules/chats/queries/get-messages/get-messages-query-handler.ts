import { and, desc, eq, lt } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, users } from "#db/drizzle/schemas.ts"
import { messagesView } from "#db/drizzle/views.ts"
import { assertMessageContent, type MessageData } from "#modules/chats/dtos/message-data.ts"

type GetMessagesQuery = {
  userId: string
  peerUsername: string
  olderThan?: Date
  quantity?: number
}

type MessagesData = {
  chatId?: string
  messages: MessageData[]
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
      .where(olderThan ? lt(messagesView.createdAt, olderThan) : undefined)
      .orderBy(desc(messagesView.createdAt))
      .limit(quantity + 1)

    const hasMore = data.length > quantity
    const messagesData = data.slice(0, quantity)

    return {
      chatId: messagesData[0]?.chatId,
      messages: messagesData.map((msg) => {
        const content = { text: msg.text, attachmentUrl: msg.attachmentUrl }

        assertMessageContent(content)

        return {
          id: msg.id,
          senderId: msg.senderId,
          createdAt: msg.createdAt.toISOString(),
          ...content,
        }
      }),
      hasMore,
    }
  }
}
