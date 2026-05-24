import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import type { AsyncEventHandlerBuilder } from "#shared/socket-io-server-types.ts"

import { ReadChatCommandHandler } from "./read-chat-command-handler.ts"

export type ReadChatEventHandler = () => void

const updateChatRead = new ReadChatCommandHandler(db)

export const onReadChat: AsyncEventHandlerBuilder<ReadChatEventHandler> = async ({ socket }) => {
  const currentUsername = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, socket.data.userId))
    .then((res) => res[0]!.username)

  return async () => {
    if (!socket.data.chat) {
      return socket.emit("exception", { message: "You must join a chat before marking it as read" })
    }

    void updateChatRead.execute({
      username: currentUsername,
      peerUsername: socket.data.chat.peerUsername,
    })
  }
}
