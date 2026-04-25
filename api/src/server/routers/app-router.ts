import { Router } from "express"

import { chatRouter } from "./chat-router.ts"
import { sessionRouter } from "./session-router.ts"
import { userRouter } from "./user-router.ts"

export const appRouter = Router()

appRouter.use("/session", sessionRouter)
appRouter.use("/users", userRouter)
appRouter.use("/chats", chatRouter)
