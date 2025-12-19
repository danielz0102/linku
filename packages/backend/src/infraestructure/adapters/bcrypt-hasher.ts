import type { PasswordHasher } from "~/application/ports/password-hasher.js"
import bcrypt from "bcryptjs"
import { SALT } from "../config/env.js"

export const BcryptHasher: PasswordHasher = {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT)
  },
  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  },
}
