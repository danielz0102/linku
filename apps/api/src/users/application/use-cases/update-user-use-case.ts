import { Result } from "#shared/lib/result.js"
import type { PublicUser } from "#users/domain/user.js"
import type { UserRepository } from "../ports/user-repository.d.js"

type Dependencies = {
  userRepo: UserRepository
}

type Input = {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  bio?: string
}

type UpdateUserError = Partial<Record<"username" | "email", string>>

export class UpdateUserUseCase {
  private readonly userRepo: UserRepository

  constructor({ userRepo }: Dependencies) {
    this.userRepo = userRepo
  }

  async execute(
    id: string,
    data: Input
  ): Promise<Result<PublicUser, UpdateUserError>> {
    if (data.username) {
      const existing = await this.userRepo.search({ username: data.username })

      if (existing && existing.id !== id) {
        return Result.fail({ username: "Username already exists" })
      }
    }

    if (data.email) {
      const existing = await this.userRepo.search({ email: data.email })

      if (existing && existing.id !== id) {
        return Result.fail({ email: "Email already exists" })
      }
    }

    const user = await this.userRepo.update(id, data)

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
