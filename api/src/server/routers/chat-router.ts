import { Router } from "express"

import { getChatsHttpController } from "#modules/chats/queries/get-chats/get-chats-http-controller.ts"

export const chatRouter = Router()

chatRouter.get("/", getChatsHttpController)
