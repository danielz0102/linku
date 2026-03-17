import type { UserRepository } from "#core/users/user-repository.js"

import { UUID } from "#core/uuid.js"

import { toPublicUser, type PublicUser } from "./dtos/public-user.js"

export class GetAuthenticatedUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string): Promise<PublicUser> {
    const user = await this.users.findOne(new UUID(id))

    if (!user) {
      throw new Error("Authenticated user was not found in repository", {
        cause: { id },
      })
    }

    return toPublicUser(user)
  }
}
