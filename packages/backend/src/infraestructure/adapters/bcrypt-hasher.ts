import { PasswordHasher } from "~/application/ports/password-hasher.js"
import bcrypt from "bcryptjs"

export const BcryptHasher: PasswordHasher = {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  },
  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  },
}
