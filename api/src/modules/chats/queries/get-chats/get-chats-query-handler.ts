import { and, desc, eq, ne, sql } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, messageReads, messages, users } from "#db/drizzle/schemas.ts"
import type { ChatMember } from "#modules/chats/domain/chat-member.ts"
import type { Message } from "#modules/chats/domain/message.ts"

type Chat = {
  id: string
  peer: ChatMember
  lastMessage: Message
}

export class GetChatsQueryHandler {
  constructor(private db: NodePgDatabase) {}

  async execute(userId: string): Promise<Chat[]> {
    const latestMessages = this.db
      .selectDistinctOn([messages.chatId], {
        chatId: messages.chatId,
        id: messages.id,
        senderId: messages.senderId,
        text: messages.text,
        attachmentUrl: messages.attachmentUrl,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .orderBy(messages.chatId, desc(messages.createdAt))
      .as("latest_messages")

    const selfMember = chatMembers
    const peerMember = alias(chatMembers, "peer_member")
    const peerUser = alias(users, "peer_user")

    const rows = await this.db
      .with(latestMessages)
      .select({
        chatId: selfMember.chatId,
        peerId: peerUser.id,
        peerUsername: peerUser.username,
        peerFirstName: peerUser.firstName,
        peerLastName: peerUser.lastName,
        peerProfilePictureUrl: peerUser.profilePictureUrl,
        messageId: latestMessages.id,
        messageSenderId: latestMessages.senderId,
        messageText: latestMessages.text,
        messageAttachmentUrl: latestMessages.attachmentUrl,
        messageCreatedAt: latestMessages.createdAt,
        messageIsRead: sql<boolean>`${messageReads.messageId} IS NOT NULL`,
      })
      .from(selfMember)
      .innerJoin(
        peerMember,
        and(eq(peerMember.chatId, selfMember.chatId), ne(peerMember.userId, userId))
      )
      .innerJoin(peerUser, eq(peerUser.id, peerMember.userId))
      .innerJoin(latestMessages, eq(latestMessages.chatId, selfMember.chatId))
      .leftJoin(
        messageReads,
        and(eq(messageReads.messageId, latestMessages.id), eq(messageReads.userId, userId))
      )
      .where(eq(selfMember.userId, userId))
      .orderBy(desc(latestMessages.createdAt))

    return rows.map((row) => ({
      id: row.chatId,
      peer: {
        id: row.peerId,
        username: row.peerUsername,
        firstName: row.peerFirstName,
        lastName: row.peerLastName,
        profilePictureUrl: row.peerProfilePictureUrl,
      },
      lastMessage: {
        id: row.messageId,
        senderId: row.messageSenderId,
        text: row.messageText,
        attachmentUrl: row.messageAttachmentUrl,
        createdAt: row.messageCreatedAt.toISOString(),
        isRead: row.messageIsRead,
      },
    }))
  }
}
