import { onJoinChat } from "#modules/chats/commands/read-chat/join-chat-event-handler.ts"
import { onReadChat } from "#modules/chats/commands/read-chat/read-chat-event-handler.ts"
import { onSendMessage } from "#modules/chats/commands/send-message/send-message-event-handler.ts"
import type { AppServer, AppSocket } from "#shared/socket-io-server-types.ts"

export const onConnection = (io: AppServer) => async (socket: AppSocket) => {
  const ctx = { socket, io }

  socket.on("join_chat", onJoinChat(ctx))
  socket.on("read_chat", onReadChat(ctx))
  socket.on("send_message", onSendMessage(ctx))
}
