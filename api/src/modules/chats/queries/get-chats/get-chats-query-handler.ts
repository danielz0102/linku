import { and, desc, eq, ne } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, files, users } from "#db/drizzle/schemas.ts"
import { messagesView } from "#db/drizzle/views.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"

type ChatMemberData = {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePictureUrl: string | null
  lastReadAt: string | null
}

type ChatData = {
  id: string
  members: [ChatMemberData, ChatMemberData]
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
        selfId: selfUser.id,
        selfUsername: selfUser.username,
        selfFirstName: selfUser.firstName,
        selfLastName: selfUser.lastName,
        selfProfilePictureUrl: selfFile.publicUrl,
        selfLastReadAt: selfMember.lastReadAt,
        peerId: peerUser.id,
        peerUsername: peerUser.username,
        peerFirstName: peerUser.firstName,
        peerLastName: peerUser.lastName,
        peerProfilePictureUrl: peerFile.publicUrl,
        peerLastReadAt: peerMember.lastReadAt,
        messageId: latestMessages.id,
        messageSenderId: latestMessages.senderId,
        messageText: latestMessages.text,
        messageAttachmentUrl: latestMessages.attachmentUrl,
        messageCreatedAt: latestMessages.createdAt,
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
      members: [
        {
          id: row.selfId,
          username: row.selfUsername,
          firstName: row.selfFirstName,
          lastName: row.selfLastName,
          profilePictureUrl: row.selfProfilePictureUrl,
          lastReadAt: row.selfLastReadAt ? row.selfLastReadAt.toISOString() : null,
        },
        {
          id: row.peerId,
          username: row.peerUsername,
          firstName: row.peerFirstName,
          lastName: row.peerLastName,
          profilePictureUrl: row.peerProfilePictureUrl,
          lastReadAt: row.peerLastReadAt ? row.peerLastReadAt.toISOString() : null,
        },
      ],
      lastMessage: {
        id: row.messageId,
        senderId: row.messageSenderId,
        text: row.messageText,
        attachmentUrl: row.messageAttachmentUrl,
        createdAt: row.messageCreatedAt.toISOString(),
      },
    }))
  }
}
