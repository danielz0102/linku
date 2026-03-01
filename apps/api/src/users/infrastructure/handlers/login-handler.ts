import type { LoginUseCase } from "#users/application/use-cases/login-use-case.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

type LoginHandler = (
  useCase: LoginUseCase
) => RequestHandler<
  never,
  LinkuAPI.Login["ResponseBody"],
  LinkuAPI.Login["RequestBody"]
>

export const loginHandler: LoginHandler = (useCase) => async (req, res) => {
  const { ok, data } = await useCase.execute(req.body)

  if (!ok) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Invalid username or password",
    })
  }

  req.session.userId = data.id
  return res.status(200).json(data)
}
