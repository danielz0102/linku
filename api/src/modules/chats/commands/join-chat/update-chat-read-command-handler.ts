import { and, eq, or } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers, users } from "#db/drizzle/schemas.ts"

type UpdateChatReadCommand = {
  username: string
  peerUsername: string
}

type MemberLookup = {
  id: string
}

export class UpdateChatReadCommandHandler {
  constructor(private readonly db: NodePgDatabase) {}

  async execute(cmd: UpdateChatReadCommand): Promise<void> {
    const { user, peer } = await this.findMembers(cmd.username, cmd.peerUsername)

    if (!user) {
      throw new Error("User not found")
    }

    if (!peer) {
      throw new Error("Peer not found")
    }

    const chatId = await this.findChatId(user.id, peer.id)

    if (!chatId) {
      throw new Error("Chat not found")
    }

    await this.db
      .update(chatMembers)
      .set({ lastReadAt: new Date() })
      .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, user.id)))
  }

  private async findMembers(
    username: string,
    peerUsername: string
  ): Promise<{ user: MemberLookup | null; peer: MemberLookup | null }> {
    const rows = await this.db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.username, peerUsername)))

    const user = rows.find((row) => row.username === username) ?? null
    const peer = rows.find((row) => row.username === peerUsername) ?? null

    return { user, peer }
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
