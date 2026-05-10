import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"
import type { EventHandler } from "#server/socket-io-server-types.ts"

import { SendMessageCommandHandler } from "./send-message-command-handler.ts"

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

export const onSendMessage: EventHandler<"send_message"> = ({ socket }) => {
  return async (data, cb) => {
    if (!socket.data.chat) {
      return socket.emit("exception", { message: "You must join a chat before sending messages" })
    }

    const validation = sendMessageDataSchema.safeParse(data)

    if (!validation.success) {
      return cb({ error: "INVALID_MESSAGE", details: validation.error.issues })
    }

    const result = await sendMessage.execute({
      senderId: socket.data.userId,
      peerUsername: socket.data.chat.peerUsername,
      attachment: validation.data.attachment,
      text: validation.data.text,
    })

    if (!result.ok) {
      return cb({ error: "PEER_NOT_FOUND" })
    }
  }
}
