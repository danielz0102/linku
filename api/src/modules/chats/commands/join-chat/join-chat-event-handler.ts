import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import type { AsyncEventHandlerBuilder } from "#shared/socket-io-server-types.ts"

import { UpdateChatReadCommandHandler } from "./update-chat-read-command-handler.ts"

export type JoinChatEventHandler = (data: { peerUsername: string }) => void

const updateChatRead = new UpdateChatReadCommandHandler(db)

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
    void updateChatRead.execute({ username: currentUsername, peerUsername })
  }
}
