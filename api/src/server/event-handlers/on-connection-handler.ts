import { onSendMessage } from "#modules/chats/commands/send-message/send-message-event-handler.ts"
import type { AppServer, AppSocket } from "#shared/socket-io-server-types.ts"

import { onJoinChat } from "./join-chat-event-handler.ts"

export const onConnection = (io: AppServer) => async (socket: AppSocket) => {
  const ctx = { socket, io }

  socket.on("join_chat", onJoinChat(ctx))
  socket.on("send_message", onSendMessage(ctx))
}
