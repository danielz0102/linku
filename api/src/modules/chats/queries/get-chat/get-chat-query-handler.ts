import { and, desc, eq, lt, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { db } from "#db/drizzle/drizzle-client.ts"
import { chatMembers, messageReads, messages, users } from "#db/drizzle/schemas.ts"
import type { ChatMember } from "#modules/chats/domain/chat-member.ts"
import type { Message } from "#modules/chats/domain/message.ts"

type GetMessagesResult =
  | {
      chatId: string
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

export async function getChat(query: GetMessagesQuery): Promise<GetMessagesResult> {
  const { userId, peerId, olderThan, quantity = 20 } = query

  const selfMember = chatMembers
  const peerMember = alias(chatMembers, "peer_member")
  const peerUser = alias(users, "peer_user")

  const [chatRow] = await db
    .select({
      chatId: selfMember.chatId,
      peerId: peerUser.id,
      peerUsername: peerUser.username,
      peerFirstName: peerUser.firstName,
      peerLastName: peerUser.lastName,
      peerProfilePictureUrl: peerUser.profilePictureUrl,
    })
    .from(selfMember)
    .innerJoin(
      peerMember,
      and(eq(peerMember.chatId, selfMember.chatId), eq(peerMember.userId, peerId))
    )
    .innerJoin(peerUser, eq(peerUser.id, peerMember.userId))
    .where(eq(selfMember.userId, userId))
    .limit(1)

  if (!chatRow) {
    return undefined
  }

  const messageConditions = [eq(messages.chatId, chatRow.chatId)]

  if (olderThan) {
    messageConditions.push(lt(messages.createdAt, olderThan))
  }

  const messageRows = await db
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
      id: chatRow.peerId,
      username: chatRow.peerUsername,
      name: `${chatRow.peerFirstName} ${chatRow.peerLastName}`,
      profilePictureUrl: chatRow.peerProfilePictureUrl,
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
