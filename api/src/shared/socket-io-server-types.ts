import type { Server, Socket } from "socket.io"

import type { SendMessageEventHandler } from "#modules/chats/commands/send-message/send-message-event-handler.ts"
import type { MessageData } from "#modules/chats/dtos/message-data.ts"

import type { JoinChatEventHandler } from "../modules/chats/commands/read-chat/join-chat-event-handler.ts"
import type { ReadChatEventHandler } from "../modules/chats/commands/read-chat/read-chat-event-handler.ts"

export interface ClientToServerEvents {
  join_chat: JoinChatEventHandler
  read_chat: ReadChatEventHandler
  send_message: SendMessageEventHandler
}

export interface ServerToClientEvents {
  new_message: (message: MessageData) => void
  exception: (error: { message: string }) => void
}

export interface SocketData {
  userId: string
  chat?: { roomId: string; peerId: string }
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
export type Context = { socket: AppSocket; io: AppServer }

export type EventHandlerBuilder<T> = (ctx: Context) => T
