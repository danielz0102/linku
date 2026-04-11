import bcrypt from "bcryptjs"

import { SALT } from "../../../env.ts"
import { PasswordHasher } from "../interfaces/password-hasher.ts"

export class BcryptHasher extends PasswordHasher {
  override hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt)
  }
  override compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}

export const hasher = new BcryptHasher(SALT)
