import type { EventHandlerBuilder } from "#server/socket-io-server-types.ts"

export type JoinChatEventHandler = (data: { peerUsername: string }) => void

export const onJoinChat: EventHandlerBuilder<JoinChatEventHandler> = ({ socket }) => {
  return async ({ peerUsername }) => {
    const roomId = [socket.data.userId, peerUsername].join("_")
    socket.data.chat = { roomId, peerUsername }
    await socket.join(roomId)
  }
}
