import { Router } from "express"

import { getChatsHttpController } from "#modules/chats/queries/get-chats/get-chats-http-controller.ts"
import { getMessagesHttpController } from "#modules/chats/queries/get-messages/get-messages-http-controller.ts"

export const chatRouter = Router()

chatRouter.get("/", getChatsHttpController)
chatRouter.get("/:peerUsername/messages", getMessagesHttpController)
