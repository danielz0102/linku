import { Result } from "#shared/lib/result.js"
import type { UserRepository } from "../../domain/user-repository.js"
import type { PrivateUser } from "../dtos/private-user.js"
import { toPrivateUser } from "../dtos/user-mapper.js"

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
  ): Promise<Result<PrivateUser, UpdateUserError>> {
    if (data.username || data.email) {
      const [existing] = await this.userRepo.matching({
        conjunction: "OR",
        filters: {
          username: data.username,
          email: data.email,
        },
        limit: 1,
      })

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

    return Result.ok(toPrivateUser(user))
  }
}
