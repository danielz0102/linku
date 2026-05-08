import io, { type Socket } from "socket.io-client"

import { SOCKET_URL } from "~/env"

export interface ClientToServerEvents {
  join_chat: (data: { peerUsername: string }) => void
  send_message: (message: {
    id: string
    text?: string
    attachment?: { url: string; public_id: string }
  }) => void
}

export interface ServerToClientEvents {}

export function createSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(SOCKET_URL, { withCredentials: true })
}
