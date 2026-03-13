import { hash, compare } from "bcryptjs"
import { PasswordHasher } from "../../application/ports/password-hasher.js"

export class BcryptHasher extends PasswordHasher {
  hash(password: string): Promise<string> {
    return hash(password, this.salt)
  }
  compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }
}
