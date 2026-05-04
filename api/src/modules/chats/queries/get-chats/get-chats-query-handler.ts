import { and, desc, eq, ne, sql } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, messageReads } from "#db/drizzle/schemas.ts"
import { messagesView, usersView } from "#db/drizzle/views.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"

type ChatMemberData = {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePictureUrl: string | null
}

type ChatData = {
  id: string
  peer: ChatMemberData
  lastMessage: MessageData
}

export class GetChatsQueryHandler {
  constructor(private db: NodePgDatabase) {}

  async execute(userId: string): Promise<ChatData[]> {
    const latestMessages = this.db
      .selectDistinctOn([messagesView.chatId], {
        id: messagesView.id,
        chatId: messagesView.chatId,
        senderId: messagesView.senderId,
        text: messagesView.text,
        attachmentUrl: messagesView.attachmentUrl,
        createdAt: messagesView.createdAt,
      })
      .from(messagesView)
      .orderBy(messagesView.chatId, desc(messagesView.createdAt))
      .as("latest_messages")

    const selfMember = chatMembers
    const peerMember = alias(chatMembers, "peer_member")

    const rows = await this.db
      .with(latestMessages)
      .select({
        chatId: selfMember.chatId,
        peerId: usersView.id,
        peerUsername: usersView.username,
        peerFirstName: usersView.firstName,
        peerLastName: usersView.lastName,
        peerProfilePictureUrl: usersView.profilePictureUrl,
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
      .innerJoin(usersView, eq(usersView.id, peerMember.userId))
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
