import { Result } from "#shared/lib/result.js"
import type { PublicUser } from "#users/domain/user.js"
import type { PasswordHasher } from "../ports/password-hasher.js"
import type { UserRepository } from "../ports/user-repository.d.js"

type Dependencies = {
  userRepo: UserRepository
  hasher: PasswordHasher
}

export type RegistrationData = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

type RegisterError = Partial<Record<"username" | "email", string>>

export class RegistrationUseCase {
  private readonly userRepo: UserRepository
  private readonly hasher: PasswordHasher

  constructor({ userRepo, hasher }: Dependencies) {
    this.userRepo = userRepo
    this.hasher = hasher
  }

  async execute({
    username,
    email,
    password,
    firstName,
    lastName,
  }: RegistrationData): Promise<Result<PublicUser, RegisterError>> {
    const existing = await this.userRepo.findOne({ username, email })

    if (existing) {
      const isSameUsername = existing.username === username
      const isSameEmail = existing.email === email

      return Result.fail({
        username: isSameUsername ? "Username already exists" : undefined,
        email: isSameEmail ? "Email already exists" : undefined,
      })
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
