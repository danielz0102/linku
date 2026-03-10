import { Router } from "express"
import { getConversationsEndpoint } from "./endpoints/get-conversations-endpoint.js"
import { getMessagesEndpoint } from "./endpoints/get-messages-endpoint.js"

const router = Router()

router.get("/", ...getConversationsEndpoint)
router.get("/:conversationId/messages", ...getMessagesEndpoint)

export { router as conversationsRouter }
