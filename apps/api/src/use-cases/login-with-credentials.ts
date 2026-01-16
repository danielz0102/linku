import { TOKEN_LIFES } from "#domain/constants/token-lifes.js"
import { toPublicUser } from "#domain/entities/user-mapper.js"
import { Result } from "#lib/result.js"
import type { PasswordHasher } from "#ports/password-hasher.js"
import type { TokenService } from "#ports/token-service.js"

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

    const { accessToken, refreshToken } = await this.signTokens(user.id)

    return Result.ok({
      user: toPublicUser(user),
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
