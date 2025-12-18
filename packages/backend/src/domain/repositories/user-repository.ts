import User from "../entities/user.js"

export interface UserRepository {
  register(user: User): Promise<User>
}
