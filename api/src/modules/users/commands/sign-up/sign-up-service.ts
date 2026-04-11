import type { UserRepository } from "../../../../shared/interfaces/user-repository.ts"
import type { PublicUser } from "../../../../shared/user.ts"
import type { PasswordHasher } from "../../interfaces/password-hasher.ts"

export class SignUpService {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher
  ) {}

  async execute(data: {
    username: string
    password: string
    firstName: string
    lastName: string
  }): Promise<PublicUser | null> {
    const existingUser = await this.users.findByUsername(data.username)

    if (existingUser) return null

    const hashedPassword = await this.hasher.hash(data.password)

    const newUser = await this.users.create({
      username: data.username,
      hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    })

    const { hashedPassword: _, ...publicUser } = newUser

    return publicUser
  }
}
