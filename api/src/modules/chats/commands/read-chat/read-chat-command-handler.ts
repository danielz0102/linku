import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { chatMembers } from "#db/drizzle/schemas.ts"
import { findChatId } from "#modules/chats/database/find-chat-id.ts"

type UpdateChatReadCommand = {
  userId: string
  peerId: string
}

export class ReadChatCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: UpdateChatReadCommand): Promise<void> {
    const chatId = await findChatId(this.db, cmd.userId, cmd.peerId)
    if (!chatId) return

    await this.db
      .update(chatMembers)
      .set({ lastReadAt: new Date() })
      .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, cmd.userId)))
  }
}
