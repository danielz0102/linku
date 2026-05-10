import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"
import type { EventHandlerBuilder } from "#shared/socket-io-server-types.ts"

import { SendMessageCommandHandler } from "./send-message-command-handler.ts"

type SendMessageError = {
  code: "PEER_NOT_FOUND" | "INVALID_MESSAGE"
  details?: unknown
}

export type SendMessageEventHandler = (
  message: {
    id: string
    text?: string
    attachment?: { url: string; public_id: string }
  },
  callback: (error?: SendMessageError) => void
) => void

const sendMessageDataSchema = z
  .object({
    id: z.uuid(),
    text: z.string().nonempty().optional(),
    attachment: z
      .object({
        url: z.url({ protocol: /^https$/ }),
        public_id: z.string().nonempty(),
      })
      .optional(),
  })
  .refine((data) => data.text || data.attachment, {
    message: "Either text or attachment must be provided",
  })

const sendMessage = new SendMessageCommandHandler(db)

export const onSendMessage: EventHandlerBuilder<SendMessageEventHandler> = ({ socket }) => {
  return async (data, cb) => {
    if (!socket.data.chat) {
      return socket.emit("exception", { message: "You must join a chat before sending messages" })
    }

    const validation = sendMessageDataSchema.safeParse(data)

    if (!validation.success) {
      return cb({ code: "INVALID_MESSAGE", details: validation.error.issues })
    }

    const result = await sendMessage.execute({
      senderId: socket.data.userId,
      peerUsername: socket.data.chat.peerUsername,
      attachment: validation.data.attachment,
      text: validation.data.text,
    })

    if (!result.ok) {
      return cb({ code: "PEER_NOT_FOUND" })
    }

    socket.to(socket.data.chat.roomId).emit("new_message", result.data)
  }
}
