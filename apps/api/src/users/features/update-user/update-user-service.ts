import type { UserRepository } from "#users/interfaces/user-repository.d.js"
import { Result } from "#shared/lib/result.js"
import type { PublicUser } from "@linku/api-contract"

export class UpdateUserService {
  private readonly userRepo: UserRepository

  constructor({ userRepo }: Dependencies) {
    this.userRepo = userRepo
  }

  async update(
    id: string,
    data: Input
  ): Promise<Result<PublicUser, UpdateUserError>> {
    if (data.username) {
      const existing = await this.userRepo.search({ username: data.username })
      if (existing && existing.id !== id) {
        return Result.fail("USERNAME_EXISTS")
      }
    }

    if (data.email) {
      const existing = await this.userRepo.search({ email: data.email })
      if (existing && existing.id !== id) {
        return Result.fail("EMAIL_EXISTS")
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

type UpdateUserError = "USERNAME_EXISTS" | "EMAIL_EXISTS"
