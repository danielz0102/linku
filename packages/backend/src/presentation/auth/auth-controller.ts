import type { Request, Response } from "express"
import { registerUser as registerUseCase } from "~/application/use-cases/register-user.js"
import User from "~/domain/entities/user.js"
import { UserRepository } from "~/domain/repositories/user-repository.js"

export class AuthController {
  constructor(private repo: UserRepository) {}

  registerUser = async (
    req: Request<unknown, unknown, User>,
    res: Response
  ) => {
    await registerUseCase(req.body, this.repo)
    res.sendStatus(201)
  }
}
