import type { UserRepository } from "#core/users/user-repository.js"

import { Result } from "#core/result.js"
import { Email } from "#core/users/email.js"
import { UUID } from "#core/uuid.js"

import { toPublicUser, type PublicUser } from "./dtos/public-user.js"

export type UpdateUserData = Partial<{
  username: string
  email: string
  firstName: string
  lastName: string
  bio: string
  profilePicUrl: string
}>

export type UpdateUserError = Partial<{
  username: "USERNAME_TAKEN"
  email: "EMAIL_TAKEN"
}>

export class UpdateUser {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string, data: UpdateUserData): Promise<Result<PublicUser, UpdateUserError>> {
    const user = await this.users.findOne(new UUID(id))

    if (!user) {
      throw new Error("Authenticated user was not found")
    }

    if (data.username || data.email) {
      const conflict = await this.users.findConflict({
        excludedId: new UUID(id),
        username: data.username ?? user.username,
        email: data.email ? new Email(data.email) : new Email(user.email),
      })

      if (conflict) {
        return Result.fail({
          username: conflict.usernameExists ? "USERNAME_TAKEN" : undefined,
          email: conflict.emailExists ? "EMAIL_TAKEN" : undefined,
        })
      }
    }

    user.update(data)
    await this.users.save(user)

    return Result.ok(toPublicUser(user))
  }
}
