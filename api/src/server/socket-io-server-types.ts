import type { Server, Socket } from "socket.io"

type SendMessageError = {
  error: "PEER_NOT_FOUND" | "INVALID_MESSAGE"
  details?: unknown
}

export interface ClientToServerEvents {
  join_chat: (data: { peerUsername: string }) => void
  send_message: (
    message: {
      id: string
      text?: string
      attachment?: { url: string; public_id: string }
    },
    callback: (error?: SendMessageError) => void
  ) => void
}

export interface ServerToClientEvents {
  new_message: (message: {}) => void
  exception: (error: { message: string }) => void
}

export interface SocketData {
  userId: string
  chat?: { roomId: string; peerUsername: string }
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
export type Context = { socket: AppSocket; io: AppServer }

export type EventHandler<E extends keyof ClientToServerEvents> = (
  ctx: Context
) => ClientToServerEvents[E]
