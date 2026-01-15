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
    res.send("Login endpoint")
  }

  register = async (req: Request, res: Response) => {
    res.send("Register endpoint")
  }
}
