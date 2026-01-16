import type { LoginWithCredentials } from "#use-cases/login-with-credentials.js"
import type { Request, Response } from "express"

type UseCases = {
  loginWithCredentials: LoginWithCredentials
}

export class AuthController {
  private readonly loginWithCredentials: LoginWithCredentials

  constructor({ loginWithCredentials }: UseCases) {
    this.loginWithCredentials = loginWithCredentials
  }

  login = async (req: Request, res: Response) => {
    const result = await this.loginWithCredentials.execute(req.body)

    if (!result.success) {
      return res.status(401).json({ error: result.error.message })
    }

    res.json(result.data)
  }

  register = async (req: Request, res: Response) => {
    res.send("Register endpoint")
  }
}
