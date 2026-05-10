import type { EventHandler } from "#server/socket-io-server-types.ts"

export const onJoinChat: EventHandler<"join_chat"> = ({ socket }) => {
  return async ({ peerUsername }) => {
    const roomId = [socket.data.userId, peerUsername].join("_")
    socket.data.chat = { roomId, peerUsername }
    await socket.join(roomId)
  }
}
