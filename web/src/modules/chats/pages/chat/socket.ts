import io, { type Socket } from "socket.io-client"

import { SOCKET_URL } from "~/env"

interface ClientToServerEvents {
  join_chat: (data: { peerUsername: string }) => void
}

interface ServerToClientEvents {}

export function createSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(SOCKET_URL, { withCredentials: true })
}
