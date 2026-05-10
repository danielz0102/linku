import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import type { AsyncEventHandlerBuilder } from "#shared/socket-io-server-types.ts"

export type JoinChatEventHandler = (data: { peerUsername: string }) => void

export const onJoinChat: AsyncEventHandlerBuilder<JoinChatEventHandler> = async ({ socket }) => {
  const currentUsername = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, socket.data.userId))
    .then((res) => res[0]!.username)

  return async ({ peerUsername }) => {
    const roomId = [currentUsername, peerUsername].sort().join("_")
    socket.data.chat = { roomId, peerUsername }
    await socket.join(roomId)
  }
}
