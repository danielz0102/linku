import type { AppSocket } from "#server/socket-io-server-types.ts"

export async function onJoinChat(socket: AppSocket, peerUsername: string) {
  const roomId = [socket.data.userId, peerUsername].join("_")
  await socket.join(roomId)
}
