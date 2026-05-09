import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, chats, files, messages, users } from "#db/drizzle/schemas.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"
import { Result } from "#shared/result.ts"

type SendMessageCommand = {
  senderId: string
  peerUsername: string
  text?: string
  attachment?: {
    url: string
    public_id: string
  }
}

type SendMessageError = "PEER_NOT_FOUND" | "INVALID_CONTENT"

type UserLookup = {
  id: string
}

export class SendMessageCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: SendMessageCommand): Promise<Result<MessageData, SendMessageError>> {
    const normalizedText = cmd.text?.trim() ?? null
    const hasText = normalizedText && normalizedText.length > 0
    const hasAttachment = cmd.attachment !== undefined

    if (!hasText && !hasAttachment) {
      return Result.fail("INVALID_CONTENT")
    }

    const sender = await this.getUserById(cmd.senderId)
    const peer = await this.getUserByUsername(cmd.peerUsername)

    if (!peer) {
      return Result.fail("PEER_NOT_FOUND")
    }

    const createdMessage = await this.db.transaction(async (tx) => {
      let chatId = await this.findChatId(tx, sender.id, peer.id)

      if (!chatId) {
        chatId = await this.createChat(tx, sender.id, peer.id)
      }

      let attachmentId: string | null = null

      if (cmd.attachment) {
        attachmentId = await tx
          .insert(files)
          .values({
            publicId: cmd.attachment.public_id,
            publicUrl: cmd.attachment.url,
          })
          .returning({ id: files.id })
          .then((rows) => rows[0]!.id)
      }

      const message = await tx
        .insert(messages)
        .values({
          chatId,
          senderId: sender.id,
          text: hasText ? normalizedText : null,
          attachmentId,
        })
        .returning()
        .then((rows) => rows[0]!)

      return {
        id: message.id,
        senderId: message.senderId,
        text: message.text,
        attachmentUrl: cmd.attachment?.url ?? null,
        createdAt: message.createdAt.toISOString(),
      }
    })

    return Result.ok(createdMessage)
  }

  private async getUserById(userId: string): Promise<UserLookup> {
    const user = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0])

    if (!user) {
      throw new Error("Sender not found", { cause: { userId } })
    }

    return user
  }

  private async getUserByUsername(username: string): Promise<UserLookup | null> {
    const user = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .then((rows) => rows[0])

    return user ?? null
  }

  private async findChatId(
    db: NodePgDatabase,
    senderId: string,
    peerId: string
  ): Promise<string | null> {
    const selfMember = alias(chatMembers, "self_member")
    const peerMember = alias(chatMembers, "peer_member")

    const row = await db
      .select({ chatId: selfMember.chatId })
      .from(selfMember)
      .innerJoin(
        peerMember,
        and(eq(peerMember.chatId, selfMember.chatId), eq(peerMember.userId, peerId))
      )
      .where(eq(selfMember.userId, senderId))
      .limit(1)
      .then((rows) => rows[0])

    return row?.chatId ?? null
  }

  private async createChat(db: NodePgDatabase, senderId: string, peerId: string) {
    const chat = await db
      .insert(chats)
      .values({})
      .returning({ id: chats.id })
      .then((rows) => rows[0]!)

    await db.insert(chatMembers).values([
      { chatId: chat.id, userId: senderId },
      { chatId: chat.id, userId: peerId },
    ])

    return chat.id
  }
}
