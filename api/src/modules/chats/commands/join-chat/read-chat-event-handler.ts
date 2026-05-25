import { db } from "#db/drizzle/drizzle-client.ts"
import type { EventHandlerBuilder } from "#shared/socket-io-server-types.ts"

import { ReadChatCommandHandler } from "./read-chat-command-handler.ts"

export type ReadChatEventHandler = () => void

const updateChatRead = new ReadChatCommandHandler(db)

export const onReadChat: EventHandlerBuilder<ReadChatEventHandler> = ({ socket }) => {
  return async () => {
    if (!socket.data.chat) {
      return socket.emit("exception", { message: "You must join a chat before marking it as read" })
    }

    void updateChatRead.execute({ userId: socket.data.userId, peerId: socket.data.chat.peerId })
  }
}
