import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "../../../../db/drizzle/drizzle-client.ts"
import { users } from "../../../../db/drizzle/schemas.ts"
import { SALT } from "../../../../env.ts"
import type { UserRepository } from "../../../../shared/interfaces/user-repository.ts"
import type { PublicUser } from "../../../../shared/user.ts"
import type { PasswordHasher } from "../../interfaces/password-hasher.ts"

type SignUpCommand = {
  username: string
  password: string
  firstName: string
  lastName: string
}

export async function signUp(cmd: SignUpCommand): Promise<string | undefined> {
  const userExists = await db
    .select({ exists: users.id })
    .from(users)
    .where(eq(users.username, cmd.username))
    .limit(1)
    .then((r) => Boolean(r[0]?.exists))

  if (userExists) return

  const hashedPassword = await bcrypt.hash(cmd.password, SALT)

  const id = await db
    .insert(users)
    .values({
      username: cmd.username,
      hashedPassword,
      firstName: cmd.firstName,
      lastName: cmd.lastName,
    })
    .returning({ id: users.id })
    .then((r) => r[0]!.id)

  return id
}

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
