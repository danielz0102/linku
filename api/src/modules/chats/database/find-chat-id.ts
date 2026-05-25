import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { alias } from "drizzle-orm/pg-core"

import { chatMembers } from "#db/drizzle/schemas.ts"

export async function findChatId(
  db: NodePgDatabase,
  userId: string,
  peerId: string
): Promise<string | null> {
  const selfMember = alias(chatMembers, "self_member")
  const peerMember = alias(chatMembers, "peer_member")

  const id = await db
    .select({ chatId: selfMember.chatId })
    .from(selfMember)
    .innerJoin(
      peerMember,
      and(eq(peerMember.chatId, selfMember.chatId), eq(peerMember.userId, peerId))
    )
    .where(eq(selfMember.userId, userId))
    .limit(1)
    .then((rows) => rows[0]?.chatId)

  return id ?? null
}
