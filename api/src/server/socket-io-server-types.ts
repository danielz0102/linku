import type { Socket } from "socket.io"

export interface ClientToServerEvents {
  join_chat: (data: { peerId: string }) => void
  chat: (message: string) => void
}

export interface ServerToClientEvents {}

export interface SocketData {
  userId: string
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
