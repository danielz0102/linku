import type { AppSocket } from "#server/socket-io-server-types.ts"

export async function onJoinChat(socket: AppSocket, peerId: string) {
  const roomId = [socket.data.userId, peerId].sort().join("_")
  await socket.join(roomId)
}
