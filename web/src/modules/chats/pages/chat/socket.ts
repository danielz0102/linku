import io, { type Socket } from "socket.io-client"

import { SOCKET_URL } from "~/env"

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
  join_chat: (data: { peerUsername: string }) => void
  send_message: (message: SendMessagePayload) => void
}

export interface ServerToClientEvents {}

export function createSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(SOCKET_URL, { withCredentials: true })
}
