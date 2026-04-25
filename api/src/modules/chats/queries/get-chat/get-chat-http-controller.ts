import type { RequestHandler } from "express"
import { z } from "zod"

import { getChat } from "./get-chat-query-handler.ts"

const getChatRequestSchema = z.object({
  peerId: z.uuid(),
  page_size: z.coerce.number().int().min(1).default(20),
  cursor: z.coerce.date().nullable(),
})

export const getChatHttpController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const { success, data, error } = getChatRequestSchema.safeParse({
    peerId: req.params["peerId"],
    page_size: req.query["page_size"],
    cursor: req.query["cursor"],
  })

  if (!success) {
    return res.status(400).json({ message: "Invalid request", details: error.issues })
  }

  const { peerId, cursor, page_size } = data

  const chat = await getChat({
    userId,
    peerId,
    olderThan: cursor ?? undefined,
    quantity: page_size,
  })

  if (!chat) {
    return res.status(404).json({ message: "Peer not found" })
  }

  res.json(chat)
}
