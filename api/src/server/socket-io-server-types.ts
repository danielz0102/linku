import type { Server, Socket } from "socket.io"

type SendMessageResponse =
  | {
      ok: true
    }
  | {
      ok: false
      error: "PEER_NOT_FOUND"
    }
  | {
      ok: false
      error: "VALIDATION_ERROR"
      details: unknown
    }

export interface ClientToServerEvents {
  join_chat: (data: { peerUsername: string }) => void
  send_message: (
    message: {
      id: string
      peerUsername: string
      text?: string
      attachment?: { url: string; public_id: string }
    },
    callback: (response?: SendMessageResponse) => void
  ) => void
}

export interface ServerToClientEvents {}

export interface SocketData {
  userId: string
  roomId?: string
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
export type Context = { socket: AppSocket; io: AppServer }

export type EventHandler<E extends keyof ClientToServerEvents> = (
  ctx: Context
) => ClientToServerEvents[E]
