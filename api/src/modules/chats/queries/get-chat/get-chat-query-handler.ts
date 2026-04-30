import { and, desc, eq, lt, sql } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, messageReads, messages, users } from "#db/drizzle/schemas.ts"
import type { ChatMember } from "#modules/chats/domain/chat-member.ts"
import type { Message } from "#modules/chats/domain/message.ts"

type GetMessagesResult =
  | {
      chatId?: string
      peer: ChatMember
      messages: Message[]
      hasMore: boolean
    }
  | undefined

type GetMessagesQuery = {
  userId: string
  peerId: string
  olderThan?: Date
  quantity?: number
}

export class GetChatQueryHandler {
  constructor(private db: NodePgDatabase) {}

  async execute(query: GetMessagesQuery): Promise<GetMessagesResult> {
    const { userId, peerId, olderThan, quantity = 20 } = query

    const peerInfo = await this.getPeerAndChatId(userId, peerId)

    if (!peerInfo) {
      return undefined
    }

    const { chatId, ...peerRow } = peerInfo

    if (!chatId) {
      return {
        peer: {
          id: peerRow.peerId,
          username: peerRow.peerUsername,
          name: peerRow.peerName,
          profilePictureUrl: peerRow.peerProfilePictureUrl,
        },
        messages: [],
        hasMore: false,
      }
    }

    const messageRows = await this.db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        content: messages.content,
        attachmentUrl: messages.attachmentUrl,
        createdAt: messages.createdAt,
        isRead: sql<boolean>`${messageReads.messageId} IS NOT NULL`,
      })
      .from(messages)
      .leftJoin(
        messageReads,
        and(eq(messageReads.messageId, messages.id), eq(messageReads.userId, userId))
      )
      .where(
        and(eq(messages.chatId, chatId), olderThan ? lt(messages.createdAt, olderThan) : undefined)
      )
      .orderBy(desc(messages.createdAt))
      .limit(quantity + 1)

    const hasMore = messageRows.length > quantity
    const selectedMessages = hasMore ? messageRows.slice(0, quantity) : messageRows

    return {
      chatId,
      peer: {
        id: peerRow.peerId,
        username: peerRow.peerUsername,
        name: peerRow.peerName,
        profilePictureUrl: peerRow.peerProfilePictureUrl,
      },
      messages: selectedMessages.map((messageRow) => ({
        id: messageRow.id,
        senderId: messageRow.senderId,
        content: messageRow.content,
        attachmentUrl: messageRow.attachmentUrl,
        createdAt: messageRow.createdAt.toISOString(),
        isRead: messageRow.isRead,
      })),
      hasMore,
    }
  }

  private async getPeerAndChatId(userId: string, peerId: string) {
    const selfMember = alias(chatMembers, "self_member")
    const peerMember = alias(chatMembers, "peer_member")

    const sharedChat = this.db
      .select({ chatId: selfMember.chatId, peerId: peerMember.userId })
      .from(selfMember)
      .innerJoin(
        peerMember,
        and(eq(peerMember.chatId, selfMember.chatId), eq(peerMember.userId, peerId))
      )
      .where(eq(selfMember.userId, userId))
      .limit(1)
      .as("shared_chat")

    return this.db
      .select({
        peerId: users.id,
        peerUsername: users.username,
        peerName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        peerProfilePictureUrl: users.profilePictureUrl,
        chatId: sharedChat.chatId,
      })
      .from(users)
      .leftJoin(sharedChat, eq(sharedChat.peerId, users.id))
      .where(eq(users.id, peerId))
      .limit(1)
      .then(([r]) => r)
  }
}
