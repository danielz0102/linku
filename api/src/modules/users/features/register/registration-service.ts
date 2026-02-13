import type { PasswordHasher } from "#modules/users/interfaces/password-hasher.js"
import type { UserRepository } from "#modules/users/interfaces/user-repository.d.js"
import { Result } from "#shared/lib/result.js"
import type { PublicUser } from "api-contract"

export class RegistrationService {
  private readonly userRepo: UserRepository
  private readonly hasher: PasswordHasher

  constructor({ userRepo, hasher }: Dependencies) {
    this.userRepo = userRepo
    this.hasher = hasher
  }

  async register(input: Input): Promise<Result<PublicUser, RegisterError>> {
    const { username, email, password, firstName, lastName } = input

    const [usernameExists, emailExists] = await Promise.all([
      this.userRepo.search({ username }),
      this.userRepo.search({ email }),
    ])

    if (usernameExists) {
      return Result.fail({ usernameExists: true })
    }

    if (emailExists) {
      return Result.fail({ emailExists: true })
    }

    const hash = await this.hasher.hash(password)
    const user = await this.userRepo.create({
      username,
      email,
      hashedPassword: hash,
      firstName,
      lastName,
    })

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

type Input = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

type RegisterError =
  | {
      usernameExists: true
      emailExists?: never
    }
  | {
      usernameExists?: never
      emailExists: true
    }
