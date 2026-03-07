import { Result } from "#shared/lib/result.js"
import type { PublicUser } from "#users/domain/user.js"
import type { UserRepository } from "../ports/user-repository.d.js"

type Dependencies = {
  userRepo: UserRepository
}

export type UpdateUserData = {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  bio?: string
  profilePicUrl?: string
}

type UpdateUserError = Partial<Record<"username" | "email", string>>

export class UpdateUserUseCase {
  private readonly userRepo: UserRepository

  constructor({ userRepo }: Dependencies) {
    this.userRepo = userRepo
  }

  async execute(
    id: string,
    data: UpdateUserData
  ): Promise<Result<PublicUser, UpdateUserError>> {
    const existing = await this.userRepo.search({
      username: data.username,
      email: data.email,
    })

    if (existing) {
      const isSameUsername = existing.username === data.username
      const isSameEmail = existing.email === data.email

      return Result.fail({
        username: isSameUsername ? "Username already exists" : undefined,
        email: isSameEmail ? "Email already exists" : undefined,
      })
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
