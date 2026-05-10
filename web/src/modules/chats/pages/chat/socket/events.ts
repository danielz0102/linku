import type { MessageAPIData } from "~/modules/chats/api/message-api-data"

type SendMessageError = {
  code: "PEER_NOT_FOUND" | "INVALID_MESSAGE"
  details?: unknown
}

export type JoinChatEvent = (data: { peerUsername: string }) => void
export type SendMessageEvent = (
  message: {
    id: string
    text?: string
    attachment?: { url: string; public_id: string }
  },
  callback: (error?: SendMessageError) => void
) => void

export type NewMessageEvent = (message: MessageAPIData) => void
export type ExceptionEvent = (error: { message: string }) => void
