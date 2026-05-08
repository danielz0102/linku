import type { Socket } from "socket.io"

export interface ClientToServerEvents {
  join_chat: (data: { peerId: string }) => void
  send_message: (message: {
    id: string
    text?: string
    attachment?: { url: string; public_id: string }
  }) => void
}

export interface ServerToClientEvents {}

export interface SocketData {
  userId: string
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
