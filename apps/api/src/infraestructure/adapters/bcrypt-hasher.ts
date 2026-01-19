import { PasswordHasher } from "#application/ports/password-hasher.js"
import bcrypt from "bcryptjs"

export class BcryptHasher extends PasswordHasher {
  override hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }
  override compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}
