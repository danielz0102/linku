import type { LoginWithCredentials } from "#application/use-cases/login-with-credentials.js"
import type { RegisterWithCredentials } from "#application/use-cases/register-with-credentials.js"
import type { Request, Response } from "express"

type UseCases = {
  loginWithCredentials: LoginWithCredentials
  registerWithCredentials: RegisterWithCredentials
}

export class AuthController {
  private readonly loginWithCredentials: LoginWithCredentials
  private readonly registerWithCredentials: RegisterWithCredentials

  constructor({ loginWithCredentials, registerWithCredentials }: UseCases) {
    this.loginWithCredentials = loginWithCredentials
    this.registerWithCredentials = registerWithCredentials
  }

  login = async (req: Request, res: Response) => {
    const result = await this.loginWithCredentials.execute(req.body)

    if (!result.success) {
      return res.status(401).json({ error: result.error.message })
    }

    const { user, accessToken } = result.data

    res.json({ user, accessToken })
  }

  register = async (req: Request, res: Response) => {
    const result = await this.registerWithCredentials.execute({
      ...req.body,
      profilePicUrl: req.file?.path,
    })

    if (!result.success) {
      return res.status(409).json({ error: result.error.message })
    }

    const { user, accessToken } = result.data

    res.status(201).json({ user, accessToken })
  }
}
