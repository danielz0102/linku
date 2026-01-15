import { Result } from "#lib/result.js"
import type { PasswordHasher } from "#ports/password-hasher.js"
import type { TokenService } from "#ports/token-service.js"
import type { UserRepository } from "#ports/user-repository.d.js"

type Dependencies = {
  repo: UserRepository
  hasher: PasswordHasher
  tokenService: TokenService
}

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
    email,
    password,
  }: Credentials): Promise<Result<{ accessToken: string }>> {
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

    const accessToken = await this.tokenService.accessToken({
      userId: user.id,
    })

    return Result.ok({ accessToken })
  }
}
