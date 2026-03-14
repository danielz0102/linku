import type { UserRepository } from "#core/users/user-repository.js"

import { Result } from "#core/result.js"
import { Email } from "#core/users/email.js"
import { User } from "#core/users/user.js"

import type { PasswordHasher } from "./ports/password-hasher.js"

import { toPublicUser, type PublicUser } from "./dtos/public-user.js"

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

  constructor({ userRepo, hasher }: { userRepo: UserRepository; hasher: PasswordHasher }) {
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
    const existing = await this.userRepo.checkUniqueness({
      username,
      email: new Email(email),
    })

    if (existing) {
      const isSameUsername = existing.username === username
      const isSameEmail = existing.email === email

      return Result.fail({
        username: isSameUsername ? "Username already exists" : undefined,
        email: isSameEmail ? "Email already exists" : undefined,
      })
    }

    const hash = await this.hasher.hash(password)
    const user = new User({
      username,
      email,
      hashedPassword: hash,
      firstName,
      lastName,
    })
    await this.userRepo.save(user)

    return Result.ok(toPublicUser(user))
  }
}
