import type { Socket } from "socket.io"

type SendMessagePayload =
  | {
      id: string
      text: string
      attachment?: { url: string; public_id: string }
    }
  | {
      id: string
      text?: string
      attachment: { url: string; public_id: string }
    }

export interface ClientToServerEvents {
  join_chat: (data: { peerId: string }) => void
  send_message: (message: SendMessagePayload) => void
}

export interface ServerToClientEvents {}

export interface SocketData {
  userId: string
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
