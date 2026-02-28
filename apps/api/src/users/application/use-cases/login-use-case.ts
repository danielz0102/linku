import { Result } from "#shared/lib/result.js"
import type { PublicUser } from "#users/domain/user.js"
import type { PasswordHasher } from "../ports/password-hasher.js"
import type { UserRepository } from "../ports/user-repository.d.js"

type Dependencies = {
  userRepo: UserRepository
  hasher: PasswordHasher
}

type LoginError = "INVALID_CREDENTIALS"

export class LoginUseCase {
  private readonly userRepo: UserRepository
  private readonly hasher: PasswordHasher

  constructor({ userRepo, hasher }: Dependencies) {
    this.userRepo = userRepo
    this.hasher = hasher
  }

  async login(input: {
    username: string
    password: string
  }): Promise<Result<PublicUser, LoginError>> {
    const user = await this.userRepo.search({ username: input.username })

    if (!user) {
      return Result.fail("INVALID_CREDENTIALS")
    }

    const isValidPassword = await this.hasher.compare(
      input.password,
      user.hashedPassword
    )

    if (!isValidPassword) {
      return Result.fail("INVALID_CREDENTIALS")
    }

    return Result.ok({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      profilePicUrl: user.profilePicUrl,
    })
  }
}
