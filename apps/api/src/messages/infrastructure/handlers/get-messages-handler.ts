import type { GetMessagesUseCase } from "#messages/application/use-cases/get-messages-use-case.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

type GetMessagesHandler = (
  useCase: GetMessagesUseCase
) => RequestHandler<
  LinkuAPI.GetMessages["Params"],
  LinkuAPI.GetMessages["ResponseBody"],
  never,
  LinkuAPI.GetMessages["Query"]
>

export const getMessagesHandler: GetMessagesHandler =
  (useCase) => async (req, res) => {
    const { userId } = req.session
    const { conversationId } = req.params
    const { limit = "50", offset = "0" } = req.query

    if (!userId) {
      throw new Error("User ID not found in session")
    }

    const result = await useCase.execute({
      userId,
      conversationId,
      limit: Number(limit),
      offset: Number(offset),
    })

    if (!result.ok) {
      if (result.error === "Forbidden") {
        return res.status(403).json({
          code: "FORBIDDEN",
          message: "You do not have access to this conversation",
        })
      }

      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Conversation not found",
      })
    }

    return res.status(200).json(result.data)
  }
