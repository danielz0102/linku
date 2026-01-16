import { toPublicUser } from "#domain/entities/user-mapper.js"
import { Result } from "#lib/result.js"
import type { PasswordHasher } from "#ports/password-hasher.js"
import type { TokenService } from "#ports/token-service.js"

type Credentials =
  | {
      username: string
      email?: never
      password: string
    }
  | {
      email: string
      username?: never
      password: string
    }

type LoginPayload = {
  user: PublicUser
  accessToken: string
  refreshToken: string
}

type Dependencies = {
  repo: UserRepository
  hasher: PasswordHasher
  tokenService: TokenService
}

export class LoginWithCredentials {
  private static readonly ACCESS_TOKEN_EXPIRATION = 60 * 60 // 1 hour
  private static readonly REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 30 // 30 days

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
    password,
  }: Credentials): Promise<Result<LoginPayload>> {
    const user = await this.repo.findBy({
      username,
      email,
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

    const { accessToken, refreshToken } = await this.signTokens(user.id)

    return Result.ok({
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    })
  }

  private async signTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signToken(
        { userId },
        LoginWithCredentials.ACCESS_TOKEN_EXPIRATION
      ),
      this.tokenService.signToken(
        { userId },
        LoginWithCredentials.REFRESH_TOKEN_EXPIRATION
      ),
    ])

    return { accessToken, refreshToken }
  }
}
