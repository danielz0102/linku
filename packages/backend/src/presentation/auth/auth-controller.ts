import type { Request, Response } from "express"
import type { RegisterUserInput } from "~/application/dtos/register-user-input.js"
import type { RegisterUser } from "~/application/use-cases/register-user.js"
import {
  toRegisterUserResult,
  type RegisterUserResult,
} from "./dtos/register-user-result.js"

export class AuthController {
  constructor(private readonly register: RegisterUser) {}

  registerUser = async (
    req: Request<unknown, unknown, RegisterUserInput>,
    res: Response<RegisterUserResult>
  ) => {
    const userRegistered = await this.register.execute(req.body)
    res.status(201).json(toRegisterUserResult(userRegistered))
  }
}
