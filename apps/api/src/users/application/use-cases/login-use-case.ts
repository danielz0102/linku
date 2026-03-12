import { Result } from "#shared/lib/result.js"
import type { UserRepository } from "../../domain/user-repository.js"
import type { PublicUser } from "../dtos/public-user.js"
import { toPublicUser } from "../dtos/user-mapper.js"
import type { PasswordHasher } from "../ports/password-hasher.js"

type Dependencies = {
  userRepo: UserRepository
  hasher: PasswordHasher
}

export type LoginCredentials = {
  username: string
  password: string
}

export class LoginUseCase {
  private readonly userRepo: UserRepository
  private readonly hasher: PasswordHasher

  constructor({ userRepo, hasher }: Dependencies) {
    this.userRepo = userRepo
    this.hasher = hasher
  }

  async execute(
    credentials: LoginCredentials
  ): Promise<Result<PublicUser, string>> {
    const [user] = await this.userRepo.matching({
      filters: { username: credentials.username },
      limit: 1,
    })

    if (!user) {
      return Result.fail("Invalid credentials")
    }

    const isValidPassword = await this.hasher.compare(
      credentials.password,
      user.password
    )

    if (!isValidPassword) {
      return Result.fail("Invalid credentials")
    }

    return Result.ok(toPublicUser(user))
  }
}
