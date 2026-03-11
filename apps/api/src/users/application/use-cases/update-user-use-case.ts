import { Criteria, Filter } from "#shared/domain/criteria.js"
import { Result } from "#shared/lib/result.js"
import type { PublicUser } from "#users/domain/user.js"
import type { UserRepository } from "../ports/user-repository.d.js"

type Dependencies = {
  userRepo: UserRepository
}

export type UpdateUserData = Partial<{
  username: string
  email: string
  firstName: string
  lastName: string
  bio: string
  profilePicUrl: string
}>

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
    const filters = [
      data.username ? new Filter("username", "eq", data.username) : null,
      data.email ? new Filter("email", "eq", data.email) : null,
    ].filter((f): f is Filter => f !== null)

    if (filters.length > 0) {
      const [existing] = await this.userRepo.matching(
        new Criteria({ filters, filterType: "OR", limit: 1 })
      )

      if (existing) {
        const isSameUsername = existing.username === data.username
        const isSameEmail = existing.email === data.email

        return Result.fail({
          username: isSameUsername ? "Username already exists" : undefined,
          email: isSameEmail ? "Email already exists" : undefined,
        })
      }
    }

    const user = await this.userRepo.update(id, data)

    return Result.ok(user.toPublic())
  }
}
