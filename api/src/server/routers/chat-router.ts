import { Router } from "express"

import { getChatHttpController } from "#modules/chats/queries/get-chat/get-chat-http-controller.ts"
import { getChatsHttpController } from "#modules/chats/queries/get-chats/get-chats-http-controller.ts"

export const chatRouter = Router()

chatRouter.get("/", getChatsHttpController)
chatRouter.get("/:peerId", getChatHttpController)
