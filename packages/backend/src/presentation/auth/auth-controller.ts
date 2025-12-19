import type { Request, Response } from "express"
import type { RegisterUserInput } from "~/application/dtos/register-user-input.js"
import type { RegisterUser } from "~/application/use-cases/register-user.js"
import {
  toRegisterUserOutput,
  type RegisterUserOutput,
} from "./dtos/register-user-output.js"

export class AuthController {
  constructor(private readonly register: RegisterUser) {}

  registerUser = async (
    req: Request<unknown, unknown, RegisterUserInput>,
    res: Response<RegisterUserOutput>
  ) => {
    const result = await this.register.execute(req.body)

    if (!result.success) {
      return res.status(400).json({ message: "User already exists" })
    }

    res.status(201).json(toRegisterUserOutput(result.data))
  }
}
