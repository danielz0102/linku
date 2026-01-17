import type { LoginCredentials, LoginPayload } from "#domain/entities/user.d.js"
import type { PasswordHasher } from "#ports/password-hasher.js"
import type { TokenService } from "#ports/token-service.js"
import type { UserRepository } from "#ports/user-repository.d.js"

import { toPublicUser } from "#domain/entities/user-mapper.js"
import { Result } from "#lib/result.js"

type Dependencies = {
  repo: UserRepository
  hasher: PasswordHasher
  tokenService: TokenService
}

export class LoginWithCredentials {
  private readonly repo: UserRepository
  private readonly hasher: PasswordHasher
  private readonly tokenService: TokenService

  constructor({ repo, hasher, tokenService }: Dependencies) {
    this.repo = repo
    this.hasher = hasher
    this.tokenService = tokenService
  }

  async execute({
    username,
    password,
  }: LoginCredentials): Promise<Result<LoginPayload>> {
    const user = await this.repo.findBy({
      username,
    })

    if (!user || !user.hashedPassword) {
      return Result.fail(new Error("Invalid credentials"))
    }

    const isPasswordValid = await this.hasher.compare(
      password,
      user.hashedPassword
    )

    if (!isPasswordValid) {
      return Result.fail(new Error("Invalid credentials"))
    }

    const { accessToken, refreshToken } =
      await this.tokenService.signAuthTokens(user.id)

    return Result.ok({
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    })
  }
}
