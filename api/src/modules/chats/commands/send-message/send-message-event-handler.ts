import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"
import type { EventHandlerBuilder } from "#shared/socket-io-server-types.ts"

import { SendMessageCommandHandler } from "./send-message-command-handler.ts"

export type SendMessageEventHandler = (
  message: {
    text?: string
    attachment?: { url: string; public_id: string }
  },
  callback: (error?: { code: "INVALID_MESSAGE"; details: unknown }) => void
) => void

const sendMessageDataSchema = z
  .object({
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

    const message = await sendMessage.execute({
      senderId: socket.data.userId,
      peerId: socket.data.chat.peerId,
      attachment: validation.data.attachment,
      text: validation.data.text,
    })

    socket.to(socket.data.chat.roomId).emit("new_message", message)
  }
}
