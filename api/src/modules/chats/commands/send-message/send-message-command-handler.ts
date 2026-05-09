import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, users } from "#db/drizzle/schemas.ts"
import { Message } from "#modules/chats/domain/message.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"
import { Result } from "#shared/result.ts"

import { MessageRepository } from "./message-repository.ts"

type SendMessageCommand = {
  senderId: string
  peerUsername: string
  text?: string
  attachment?: {
    url: string
    public_id: string
  }
}

type SendMessageError = "PEER_NOT_FOUND"

type UserLookup = {
  id: string
}

export class SendMessageCommandHandler {
  private messages: MessageRepository

  constructor(private readonly db: NodePgDatabase) {
    this.messages = new MessageRepository(db)
  }

  async execute(cmd: SendMessageCommand): Promise<Result<MessageData, SendMessageError>> {
    const [sender, peer] = await Promise.all([
      this.getMemberById(cmd.senderId),
      this.getMemberByUsername(cmd.peerUsername),
    ])

    if (!sender) {
      throw new Error("Sender not found")
    }

    if (!peer) {
      return Result.fail("PEER_NOT_FOUND")
    }

    const chatId = await this.findChatId(sender.id, peer.id)

    const message = Message.create({
      chatId,
      senderId: sender.id,
      text: cmd.text,
      attachmentUrl: cmd.attachment?.url,
    })

    await this.messages.save({ message, peerId: peer.id, filePublicId: cmd.attachment?.public_id })

    if (message.chatId === null) {
      throw new Error("Message wasn't persisted correctly: missing chatId")
    }

    return Result.ok({
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      text: message.text,
      attachmentUrl: message.attachmentUrl,
      createdAt: message.createdAt.toISOString(),
    })
  }

  private async findChatId(senderId: string, peerId: string): Promise<string | null> {
    const selfMember = alias(chatMembers, "self_member")
    const peerMember = alias(chatMembers, "peer_member")

    const row = await this.db
      .select({ chatId: selfMember.chatId })
      .from(selfMember)
      .innerJoin(
        peerMember,
        and(eq(peerMember.chatId, selfMember.chatId), eq(peerMember.userId, peerId))
      )
      .where(eq(selfMember.userId, senderId))
      .limit(1)
      .then((rows) => rows[0])

    return row ? row.chatId : null
  }

  private async getMemberById(userId: string): Promise<UserLookup | null> {
    const user = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0])

    return user ?? null
  }

  private async getMemberByUsername(username: string): Promise<UserLookup | null> {
    const user = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .then((rows) => rows[0])

    return user ?? null
  }
}
