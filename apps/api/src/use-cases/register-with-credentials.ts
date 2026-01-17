import type {
  LoginPayload,
  RegisterCredentials,
} from "#domain/entities/user.d.js"
import type { PasswordHasher } from "#ports/password-hasher.js"
import type { TokenService } from "#ports/token-service.js"
import type { UserRepository } from "#ports/user-repository.d.js"

import { TOKEN_LIFES } from "#domain/constants/token-lifes.js"
import { toPublicUser } from "#domain/entities/user-mapper.js"
import { Result } from "#lib/result.js"

type Dependencies = {
  repo: UserRepository
  hasher: PasswordHasher
  tokenService: TokenService
}

export class RegisterWithCredentials {
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
    email,
    firstName,
    lastName,
    password,
  }: RegisterCredentials): Promise<Result<LoginPayload>> {
    const existingUser = await this.repo.findBy({ username, email })

    if (existingUser) {
      return Result.fail(new Error("User already exists"))
    }

    const hashedPassword = await this.hasher.hash(password)
    const newUser = await this.repo.create({
      username,
      email,
      firstName,
      lastName,
      hashedPassword,
    })
    const { accessToken, refreshToken } = await this.signTokens(newUser.id)

    return Result.ok({
      user: toPublicUser(newUser),
      accessToken,
      refreshToken,
    })
  }

  private async signTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signToken({ userId }, TOKEN_LIFES.ACCESS_TOKEN),
      this.tokenService.signToken({ userId }, TOKEN_LIFES.REFRESH_TOKEN),
    ])

    return { accessToken, refreshToken }
  }
}
