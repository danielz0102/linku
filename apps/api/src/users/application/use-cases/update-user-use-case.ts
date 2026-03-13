import { UUID } from "#shared/domain/uuid.js"
import { Result } from "#shared/lib/result.js"
import { Email } from "#users/domain/email.js"
import type { UserRepository } from "../../domain/user-repository.js"
import type { PublicUser } from "../dtos/public-user.js"
import { toPublicUser } from "../dtos/user-mapper.js"

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
  constructor(private readonly repo: UserRepository) {}

  async execute(
    id: string,
    data: UpdateUserData
  ): Promise<Result<PublicUser, UpdateUserError>> {
    const user = await this.repo.findExisting({ id: new UUID(id) })

    if (!user) {
      throw new Error("User who should be authenticated was not found")
    }

    if (data.username || data.email) {
      const existing = await this.repo.checkUniqueness({
        id: new UUID(id),
        username: data.username,
        email: data.email ? new Email(data.email) : undefined,
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

    user.update(data)
    await this.repo.save(user)

    return Result.ok(toPublicUser(user))
  }
}
