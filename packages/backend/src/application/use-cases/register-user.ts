import type User from "~/domain/entities/user.js"
import type { UserRepository } from "~/domain/repositories/user-repository.js"
import type { RegisterUserInput } from "../dtos/register-user-input.js"
import type { PasswordHasher } from "../ports/password-hasher.js"

import { Result } from "~/domain/primitives/result.js"
import { BusinessError } from "../errors.js"

export class RegisterUser {
  constructor(
    private repo: UserRepository,
    private hasher: PasswordHasher
  ) {}

  async execute(user: RegisterUserInput): Promise<Result<User>> {
    const userExists = await this.repo.exists(user.email.value, user.username)

    if (userExists) {
      return Result.fail(new BusinessError("User already exists"))
    }

    const hashedPassword = await this.hasher.hash(user.password.value)
    const registeredUser = await this.repo.register({
      ...user,
      email: user.email.value,
      passwordHash: hashedPassword,
    })

    return Result.ok(registeredUser)
  }
}
