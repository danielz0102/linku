import { Result } from "#lib/result.js"
import type { UserRepository } from "#users/interfaces/user-repository.d.js"
import type { PublicUser } from "#users/types.d.js"

export class RegisterService {
  private readonly userRepo: UserRepository
  private readonly hashPassword: (password: string) => Promise<string>

  constructor({ userRepo, hashPassword }: Dependencies) {
    this.userRepo = userRepo
    this.hashPassword = hashPassword
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

    const hash = await this.hashPassword(password)
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
  hashPassword: (password: string) => Promise<string>
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
