import type { UserRecord } from "#db/drizzle/schemas.js"
import { Result } from "#lib/result.js"
import type { PasswordHasher } from "#ports/password-hasher.js"
import type { TokenService } from "#ports/token-service.js"
import type { UserRepository } from "#ports/user-repository.d.js"

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

type PrivateUserFields = Pick<UserRecord, "hashedPassword">
type PublicUser = Omit<UserRecord, keyof PrivateUserFields>
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
  private readonly repo: UserRepository
  private readonly hasher: PasswordHasher
  private readonly tokenService: TokenService

  private static readonly ACCESS_TOKEN_EXPIRATION = 60 * 60 // 1 hour
  private static readonly REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 30 // 30 days

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

    const accessToken = await this.tokenService.signToken(
      {
        userId: user.id,
      },
      LoginWithCredentials.ACCESS_TOKEN_EXPIRATION
    )

    const refreshToken = await this.tokenService.signToken(
      {
        userId: user.id,
      },
      LoginWithCredentials.REFRESH_TOKEN_EXPIRATION
    )

    return Result.ok({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicId: user.profilePicId,
        bio: user.bio,
        signUpAt: user.signUpAt,
        status: user.status,
      },
      accessToken,
      refreshToken,
    })
  }
}
