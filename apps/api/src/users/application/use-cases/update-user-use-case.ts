import { Result } from "#shared/lib/result.js"
import type { PublicUser } from "#users/domain/user.js"
import type { UserRepository } from "../ports/user-repository.d.js"

type Dependencies = {
  userRepo: UserRepository
}

type Data = {
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
    data: Data
  ): Promise<Result<PublicUser, UpdateUserError>> {
    const [usernameExists, emailExists] = await Promise.all([
      data.username
        ? this.userRepo.exists({ id, username: data.username })
        : false,
      data.email ? this.userRepo.exists({ id, email: data.email }) : false,
    ])

    if (usernameExists || emailExists) {
      return Result.fail({
        username: usernameExists ? "Username already exists" : undefined,
        email: emailExists ? "Email already exists" : undefined,
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
