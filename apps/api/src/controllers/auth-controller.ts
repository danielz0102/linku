import type { AuthModel } from "#models/auth-model.js"
import type { Request, Response } from "express"

export class AuthController {
  constructor(private readonly model: AuthModel) {}

  login = async (req: Request, res: Response) => {
    res.send("Login endpoint")
  }

  register = async (req: Request, res: Response) => {
    res.send("Register endpoint")
  }
}
