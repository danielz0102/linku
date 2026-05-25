import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers } from "#db/drizzle/schemas.ts"
import { Message } from "#modules/chats/domain/message.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"

import { MessageRepository } from "./message-repository.ts"

type SendMessageCommand = {
  senderId: string
  peerId: string
  text?: string
  attachment?: {
    url: string
    public_id: string
  }
}

export class SendMessageCommandHandler {
  private messages: MessageRepository

  constructor(private readonly db: NodePgDatabase) {
    this.messages = new MessageRepository(db)
  }

  async execute(cmd: SendMessageCommand): Promise<MessageData> {
    const chatId = await this.findChatId(cmd.senderId, cmd.peerId)
    const message = Message.create({
      chatId,
      senderId: cmd.senderId,
      text: cmd.text,
      attachmentUrl: cmd.attachment?.url,
    })

    await this.messages.save({
      message,
      peerId: cmd.peerId,
      filePublicId: cmd.attachment?.public_id,
    })

    if (message.chatId === null) {
      throw new Error("Chat ID is missing after saving the message", {
        cause: { messsageId: message.id },
      })
    }

    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      text: message.text,
      attachmentUrl: message.attachmentUrl,
      createdAt: message.createdAt.toISOString(),
    }
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
}
