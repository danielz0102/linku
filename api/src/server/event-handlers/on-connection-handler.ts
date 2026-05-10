import type { AppServer, AppSocket } from "#shared/socket-io-server-types.ts"

import { onJoinChat } from "./join-chat-event-handler.ts"

export const onConnection = (io: AppServer) => async (socket: AppSocket) => {
  const ctx = { socket, io }

  socket.on("join_chat", onJoinChat(ctx))
}
