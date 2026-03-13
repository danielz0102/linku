import type { SearchUsersUseCase } from "#users/application/use-cases/search-users.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

type SearchUsersHandler = (
  search: SearchUsersUseCase
) => RequestHandler<never, LinkuAPI.GetUsers["ResponseBody"], never, LinkuAPI.GetUsers["Query"]>

export const searchUsersHandler: SearchUsersHandler = (search) => async (req, res) => {
  const { q, limit = 20, offset = 0 } = req.query
  const users = await search.execute(q, Number(limit), Number(offset))
  return res.status(200).json(users)
}
