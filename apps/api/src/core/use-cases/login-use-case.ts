import type { UserRepository } from "#core/users/user-repository.js"

import { Result } from "#core/result.js"

import type { PasswordHasher } from "./ports/password-hasher.js"

import { toPublicUser, type PublicUser } from "./dtos/public-user.js"

export type LoginCredentials = {
  username: string
  password: string
}

export type LoginError = "INVALID_CREDENTIALS"

export class LoginUseCase {
  private readonly users: UserRepository
  private readonly hasher: PasswordHasher

  constructor({ userRepo, hasher }: { userRepo: UserRepository; hasher: PasswordHasher }) {
    this.users = userRepo
    this.hasher = hasher
  }

  async execute({ username, password }: LoginCredentials): Promise<Result<PublicUser, LoginError>> {
    const user = await this.users.findOne(username)

    if (!user) {
      return Result.fail("INVALID_CREDENTIALS")
    }

    const isValidPassword = await this.hasher.compare(password, user.password)

    if (!isValidPassword) {
      return Result.fail("INVALID_CREDENTIALS")
    }

    return Result.ok(toPublicUser(user))
  }
}
