import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers } from "#db/drizzle/schemas.ts"

type UpdateChatReadCommand = {
  userId: string
  peerId: string
}

export class ReadChatCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: UpdateChatReadCommand): Promise<void> {
    const chatId = await this.findChatId(cmd.userId, cmd.peerId)

    if (!chatId) {
      throw new Error("Chat not found")
    }

    await this.db
      .update(chatMembers)
      .set({ lastReadAt: new Date() })
      .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, cmd.userId)))
  }

  private async findChatId(userId: string, peerId: string): Promise<string | null> {
    const selfMember = alias(chatMembers, "self_member")
    const peerMember = alias(chatMembers, "peer_member")

    const row = await this.db
      .select({ chatId: selfMember.chatId })
      .from(selfMember)
      .innerJoin(
        peerMember,
        and(eq(peerMember.chatId, selfMember.chatId), eq(peerMember.userId, peerId))
      )
      .where(eq(selfMember.userId, userId))
      .limit(1)
      .then((rows) => rows[0])

    return row ? row.chatId : null
  }
}
