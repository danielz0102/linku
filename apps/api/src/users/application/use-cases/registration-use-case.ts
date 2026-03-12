import { Result } from "#shared/lib/result.js"
import { User } from "#users/domain/user.js"
import type { UserRepository } from "../../domain/user-repository.js"
import type { PrivateUser } from "../dtos/private-user.js"
import { toPrivateUser } from "../dtos/user-mapper.js"
import type { PasswordHasher } from "../ports/password-hasher.js"

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
  }: RegistrationData): Promise<Result<PrivateUser, RegisterError>> {
    const [existing] = await this.userRepo.matching({
      mode: "OR",
      filters: { username, email },
      limit: 1,
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

    return Result.ok(toPrivateUser(user))
  }
}
