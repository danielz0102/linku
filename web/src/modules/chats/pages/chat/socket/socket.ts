import io, { type Socket } from "socket.io-client"

import { SOCKET_URL } from "~/env"

import type { ExceptionEvent, JoinChatEvent, NewMessageEvent, SendMessageEvent } from "./events"

export interface ClientToServerEvents {
  join_chat: JoinChatEvent
  send_message: SendMessageEvent
}

interface ServerToClientEvents {
  new_message: NewMessageEvent
  exception: ExceptionEvent
}

export function createSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(SOCKET_URL, { withCredentials: true })
}
