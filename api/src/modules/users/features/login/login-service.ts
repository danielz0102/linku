import type { PasswordHasher } from "#modules/users/interfaces/password-hasher.js"
import type { UserRepository } from "#modules/users/interfaces/user-repository.d.js"
import { Result } from "#shared/lib/result.js"
import type { LoginBody, PublicUser } from "api-contract"

export class LoginService {
  private readonly userRepo: UserRepository
  private readonly hasher: PasswordHasher

  constructor({ userRepo, hasher }: Dependencies) {
    this.userRepo = userRepo
    this.hasher = hasher
  }

  async login(input: LoginBody): Promise<Result<PublicUser, LoginError>> {
    const user = await this.userRepo.search({ email: input.email })

    if (!user) {
      return Result.fail("invalidCredentials")
    }

    const isValidPassword = await this.hasher.compare(
      input.password,
      user.hashedPassword
    )

    if (!isValidPassword) {
      return Result.fail("invalidCredentials")
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

type Dependencies = {
  userRepo: UserRepository
  hasher: PasswordHasher
}

type LoginError = "invalidCredentials"
