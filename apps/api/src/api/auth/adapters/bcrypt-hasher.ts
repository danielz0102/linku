import { PasswordHasher } from "#core/use-cases/ports/password-hasher.js"
import { hash, compare } from "bcryptjs"

export class BcryptHasher extends PasswordHasher {
  hash(password: string): Promise<string> {
    return hash(password, this.salt)
  }
  compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }
}
