import type { Request, Response } from "express"
import { RegisterUser } from "~/application/use-cases/register-user.js"

type RegisterUserBody = {
  username: string
  email: string
  password: string
}

export class AuthController {
  constructor(private readonly register: RegisterUser) {}

  registerUser = async (
    req: Request<unknown, unknown, RegisterUserBody>,
    res: Response
  ) => {
    const userRegistered = await this.register.execute(req.body)

    // TODO: return a proper DTO
    res.status(201).json(userRegistered)
  }
}
