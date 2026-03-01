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
    const [usernameExists, emailExists] = await Promise.all([
      data.username
        ? this.userRepo
            .search({ id, username: data.username })
            .then((user) => Boolean(user))
        : false,
      data.email
        ? this.userRepo
            .search({ id, email: data.email })
            .then((user) => Boolean(user))
        : false,
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
