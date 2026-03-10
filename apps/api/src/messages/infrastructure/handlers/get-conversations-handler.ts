import type { GetConversationsUseCase } from "#messages/application/use-cases/get-conversations-use-case.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

type GetConversationsHandler = (
  useCase: GetConversationsUseCase
) => RequestHandler<never, LinkuAPI.GetConversations["ResponseBody"]>

export const getConversationsHandler: GetConversationsHandler =
  (useCase) => async (req, res) => {
    const { userId } = req.session

    if (!userId) {
      throw new Error("User ID not found in session")
    }

    const conversations = await useCase.execute(userId)

    return res.status(200).json(conversations)
  }
