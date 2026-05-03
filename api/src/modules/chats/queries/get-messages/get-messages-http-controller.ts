import type { RequestHandler } from "express"
import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"

import { GetMessagesQueryHandler } from "./get-messages-query-handler.ts"

const getMessages = new GetMessagesQueryHandler(db)

const getChatRequestSchema = z.object({
  peerUsername: z.string().nonempty(),
  page_size: z.coerce.number().int().min(1).default(20),
  cursor: z.coerce.date().optional(),
})

export const getMessagesHttpController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const { success, data, error } = getChatRequestSchema.safeParse({
    peerUsername: req.params["peerUsername"],
    page_size: req.query["page_size"],
    cursor: req.query["cursor"],
  })

  if (!success) {
    return res.sendValidationError(error.issues)
  }

  const { peerUsername, cursor, page_size } = data

  const messages = await getMessages.execute({
    userId,
    peerUsername,
    olderThan: cursor,
    quantity: page_size,
  })

  res.json(messages)
}
