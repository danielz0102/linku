import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { findChatId } from "#modules/chats/database/find-chat-id.ts"
import { Message } from "#modules/chats/domain/message.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"

import { MessageStorage } from "./message-storage.ts"

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
  private messages: MessageStorage

  constructor(private readonly db: NodePgDatabase) {
    this.messages = new MessageStorage(db)
  }

  async execute(cmd: SendMessageCommand): Promise<MessageData> {
    const chatId = await findChatId(this.db, cmd.senderId, cmd.peerId)
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
}
