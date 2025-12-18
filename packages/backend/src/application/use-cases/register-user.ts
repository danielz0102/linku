import User from "~/domain/entities/user.js"
import { UserRepository } from "~/domain/repositories/user-repository.js"

export async function registerUser(
  user: User,
  repo: UserRepository
): Promise<User> {
  return repo.register(user)
}
