import type { UserRepository } from "#core/users/user-repository.js"

import { Result } from "#core/result.js"
import { Email } from "#core/users/email.js"
import { User } from "#core/users/user.js"

import type { PasswordHasher } from "./ports/password-hasher.ts"

import { toPublicUser, type PublicUser } from "./dtos/public-user.js"

export type RegistrationData = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export type RegistrationError = Partial<{
  username: "USERNAME_TAKEN"
  email: "EMAIL_TAKEN"
}>

export class Register {
  private readonly users: UserRepository
  private readonly hasher: PasswordHasher

  constructor({ userRepo, hasher }: { userRepo: UserRepository; hasher: PasswordHasher }) {
    this.users = userRepo
    this.hasher = hasher
  }

  async execute({
    username,
    email,
    password,
    firstName,
    lastName,
  }: RegistrationData): Promise<Result<PublicUser, RegistrationError>> {
    const conflict = await this.users.findConflict({
      username,
      email: new Email(email),
    })

    if (conflict) {
      return Result.fail({
        username: conflict.usernameExists ? "USERNAME_TAKEN" : undefined,
        email: conflict.emailExists ? "EMAIL_TAKEN" : undefined,
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
    await this.users.save(user)

    return Result.ok(toPublicUser(user))
  }
}
