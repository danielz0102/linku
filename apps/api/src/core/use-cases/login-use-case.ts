import type { UserRepository } from "#core/users/user-repository.d.js"

import { Result } from "#core/result.js"

import type { PasswordHasher } from "./ports/password-hasher.js"

import { toPublicUser, type PublicUser } from "./dtos/public-user.js"

export class LoginUseCase {
  private readonly userRepo: UserRepository
  private readonly hasher: PasswordHasher

  constructor({ userRepo, hasher }: { userRepo: UserRepository; hasher: PasswordHasher }) {
    this.userRepo = userRepo
    this.hasher = hasher
  }

  async execute({
    username,
    password,
  }: {
    username: string
    password: string
  }): Promise<Result<PublicUser>> {
    const user = await this.userRepo.findExisting({ username })

    if (!user) {
      return Result.fail("Invalid credentials")
    }

    const isValidPassword = await this.hasher.compare(password, user.password)

    if (!isValidPassword) {
      return Result.fail("Invalid credentials")
    }

    return Result.ok(toPublicUser(user))
  }
}
