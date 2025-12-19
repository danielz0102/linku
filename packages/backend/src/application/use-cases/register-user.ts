import User from "~/domain/entities/user.js"
import { UserRepository } from "~/domain/repositories/user-repository.js"
import { RegisterUserInput } from "../dtos/register-user-input.js"
import { PasswordHasher } from "../ports/password-hasher.js"

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
