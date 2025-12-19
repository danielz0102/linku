import type User from "~/domain/entities/user.js"
import type { UserRepository } from "~/domain/repositories/user-repository.js"
import type { RegisterUserInput } from "../dtos/register-user-input.js"
import type { PasswordHasher } from "../ports/password-hasher.js"

export class RegisterUser {
  constructor(
    private repo: UserRepository,
    private hasher: PasswordHasher
  ) {}

  async execute(user: RegisterUserInput): Promise<User> {
    const hashedPassword = await this.hasher.hash(user.password)

    return this.repo.register({
      ...user,
      passwordHash: hashedPassword,
    })
  }
}
