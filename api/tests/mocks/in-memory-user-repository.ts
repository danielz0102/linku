import { randomUUID } from "node:crypto"

import type {
  CreateUserParams,
  UserRepository,
} from "../../src/shared/interfaces/user-repository.ts"
import type { User } from "../../src/shared/user.ts"

export class InMemoryUserRepository implements UserRepository {
  private readonly usersByUsername = new Map<string, User>()

  async findByUsername(username: string): Promise<User | null> {
    return this.usersByUsername.get(username) ?? null
  }

  async create(user: CreateUserParams): Promise<User> {
    const newUser: User = {
      id: randomUUID(),
      username: user.username,
      hashedPassword: user.hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio ?? null,
      profilePictureUrl: user.profilePictureUrl ?? null,
    }

    this.usersByUsername.set(newUser.username, newUser)

    return newUser
  }
}
