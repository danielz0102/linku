import type { UserRepository } from "#core/users/user-repository.js"

import { UUID } from "#core/uuid.js"

import { toPublicUser, type PublicUser } from "./dtos/public-user.js"

export class GetUserByIdUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string): Promise<PublicUser | null> {
    const user = await this.users.findOne(new UUID(id))

    if (!user) {
      return null
    }

    return toPublicUser(user)
  }
}
