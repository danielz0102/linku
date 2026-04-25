import type { RequestHandler } from "express"

import { getChats } from "./get-chats-query-handler.ts"

export const getChatsHttpController: RequestHandler = async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    return res.sendStatus(401)
  }

  const chats = await getChats(userId)
  res.json(chats)
}
