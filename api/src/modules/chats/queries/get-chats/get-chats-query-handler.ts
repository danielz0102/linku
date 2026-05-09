import { and, desc, eq, ne } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, files, users } from "#db/drizzle/schemas.ts"
import { messagesView } from "#db/drizzle/views.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"

type ChatPeerData = {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePictureUrl: string | null
}

type ChatData = {
  id: string
  peer: ChatPeerData
  lastReadAt: string | null
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

    const selfMember = alias(chatMembers, "self_member")
    const peerMember = alias(chatMembers, "peer_member")
    const selfUser = alias(users, "self_user")
    const peerUser = alias(users, "peer_user")
    const selfFile = alias(files, "self_file")
    const peerFile = alias(files, "peer_file")

    const rows = await this.db
      .with(latestMessages)
      .select({
        chatId: selfMember.chatId,
        self: {
          id: selfUser.id,
          username: selfUser.username,
          firstName: selfUser.firstName,
          lastName: selfUser.lastName,
          profilePictureUrl: selfFile.publicUrl,
          lastReadAt: selfMember.lastReadAt,
        },
        peer: {
          id: peerUser.id,
          username: peerUser.username,
          firstName: peerUser.firstName,
          lastName: peerUser.lastName,
          profilePictureUrl: peerFile.publicUrl,
          lastReadAt: peerMember.lastReadAt,
        },
        message: {
          id: latestMessages.id,
          senderId: latestMessages.senderId,
          text: latestMessages.text,
          attachmentUrl: latestMessages.attachmentUrl,
          createdAt: latestMessages.createdAt,
        },
      })
      .from(selfMember)
      .innerJoin(
        peerMember,
        and(eq(peerMember.chatId, selfMember.chatId), ne(peerMember.userId, userId))
      )
      .innerJoin(selfUser, eq(selfUser.id, selfMember.userId))
      .innerJoin(peerUser, eq(peerUser.id, peerMember.userId))
      .leftJoin(selfFile, eq(selfFile.id, selfUser.profilePictureId))
      .leftJoin(peerFile, eq(peerFile.id, peerUser.profilePictureId))
      .innerJoin(latestMessages, eq(latestMessages.chatId, selfMember.chatId))
      .where(eq(selfMember.userId, userId))
      .orderBy(desc(latestMessages.createdAt))

    return rows.map((row) => ({
      id: row.chatId,
      peer: {
        id: row.peer.id,
        username: row.peer.username,
        firstName: row.peer.firstName,
        lastName: row.peer.lastName,
        profilePictureUrl: row.peer.profilePictureUrl,
      },
      lastReadAt: row.self.lastReadAt ? row.self.lastReadAt.toISOString() : null,
      lastMessage: {
        id: row.message.id,
        senderId: row.message.senderId,
        text: row.message.text,
        attachmentUrl: row.message.attachmentUrl,
        createdAt: row.message.createdAt.toISOString(),
      },
    }))
  }
}
