import type { RequestHandler } from "express"

import { db } from "#db/drizzle/drizzle-client.ts"

import { GetChatsQueryHandler } from "./get-chats-query-handler.ts"

const getChats = new GetChatsQueryHandler(db)

export const getChatsHttpController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const chats = await getChats.execute(userId)
  res.json(chats)
}
