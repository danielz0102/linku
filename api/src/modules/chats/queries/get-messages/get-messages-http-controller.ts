import type { RequestHandler } from "express"
import { z } from "zod"

import { db } from "#db/drizzle/drizzle-client.ts"

import { GetMessagesQueryHandler } from "./get-messages-query-handler.ts"

const getMessages = new GetMessagesQueryHandler(db)

const getChatRequestSchema = z.object({
  peerUsername: z.string().nonempty(),
  limit: z.coerce.number().int().min(1).default(20),
  before: z.coerce.date().optional(),
})

export const getMessagesHttpController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const { success, data, error } = getChatRequestSchema.safeParse({
    peerUsername: req.params["peerUsername"],
    limit: req.query["limit"],
    before: req.query["before"],
  })

  if (!success) {
    return res.sendValidationError(error.issues)
  }

  const { peerUsername, before, limit } = data

  const messages = await getMessages.execute({
    userId,
    peerUsername,
    before,
    limit,
  })

  res.json(messages)
}
