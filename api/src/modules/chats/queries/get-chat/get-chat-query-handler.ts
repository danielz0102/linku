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

    const [peerRow] = await this.db
      .select({
        peerId: users.id,
        peerUsername: users.username,
        peerFirstName: users.firstName,
        peerLastName: users.lastName,
        peerProfilePictureUrl: users.profilePictureUrl,
      })
      .from(users)
      .where(eq(users.id, peerId))
      .limit(1)

    if (!peerRow) {
      return undefined
    }

    const selfMember = chatMembers
    const peerMember = alias(chatMembers, "peer_member")

    const [chatRow] = await this.db
      .select({
        chatId: selfMember.chatId,
      })
      .from(selfMember)
      .innerJoin(
        peerMember,
        and(eq(peerMember.chatId, selfMember.chatId), eq(peerMember.userId, peerId))
      )
      .where(eq(selfMember.userId, userId))
      .limit(1)

    if (!chatRow) {
      return {
        peer: {
          id: peerRow.peerId,
          username: peerRow.peerUsername,
          name: `${peerRow.peerFirstName} ${peerRow.peerLastName}`,
          profilePictureUrl: peerRow.peerProfilePictureUrl,
        },
        messages: [],
        hasMore: false,
      }
    }

    const messageConditions = [eq(messages.chatId, chatRow.chatId)]

    if (olderThan) {
      messageConditions.push(lt(messages.createdAt, olderThan))
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
      .where(and(...messageConditions))
      .orderBy(desc(messages.createdAt))
      .limit(quantity + 1)

    const hasMore = messageRows.length > quantity
    const selectedMessages = hasMore ? messageRows.slice(0, quantity) : messageRows

    return {
      chatId: chatRow.chatId,
      peer: {
        id: peerRow.peerId,
        username: peerRow.peerUsername,
        name: `${peerRow.peerFirstName} ${peerRow.peerLastName}`,
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
}
