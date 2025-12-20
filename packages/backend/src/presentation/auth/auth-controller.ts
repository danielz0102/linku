import type { Request, Response } from "express"
import type { RegisterUser } from "~/application/use-cases/register-user.js"
import type { RegisterUserRequest } from "./dtos/register-user-request.js"
import type { RegisterUserResponse } from "./dtos/register-user-response.js"

import { RegisterUserRequestMapper as requestMapper } from "./dtos/register-user-request.js"
import { RegisterUserResponseMapper as responseMapper } from "./dtos/register-user-response.js"

export class AuthController {
  constructor(private readonly register: RegisterUser) {}

  registerUser = async (
    req: Request<unknown, unknown, RegisterUserRequest>,
    res: Response<RegisterUserResponse>
  ) => {
    const result = await this.register.execute(requestMapper.toInput(req.body))

    if (!result.success) {
      return res.status(400).json({ message: "User already exists" })
    }

    res.status(201).json(responseMapper.fromEntity(result.data))
  }
}
