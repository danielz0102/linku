import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import type { EventHandlerBuilder } from "#shared/socket-io-server-types.ts"

import { ReadChatCommandHandler } from "./read-chat-command-handler.ts"

export type JoinChatEventHandler = (data: { peerUsername: string }) => void

const updateChatRead = new ReadChatCommandHandler(db)

export const onJoinChat: EventHandlerBuilder<JoinChatEventHandler> = ({ socket }) => {
  return async ({ peerUsername }) => {
    const peerId = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, peerUsername))
      .then((res) => res[0]?.id)

    if (!peerId) {
      return socket.emit("exception", { message: "Peer not found" })
    }

    const roomId = [socket.data.userId, peerId].sort().join("_")
    await socket.join(roomId)
    socket.data.chat = { roomId, peerId, peerUsername }

    void updateChatRead.execute({
      userId: socket.data.userId,
      peerId,
    })
  }
}
