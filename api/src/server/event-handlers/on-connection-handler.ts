import type { AppSocket } from "#server/socket-io-server-types.ts"

import { onJoinChat } from "./join-chat-event-handler.ts"

export const onConnection = (socket: AppSocket) => {
  socket.on("join_chat", ({ peerId }) => onJoinChat(socket, peerId))
}
