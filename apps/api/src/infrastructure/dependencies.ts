import type { FileService } from "#application/ports/file-service.d.js"
import type { PasswordHasher } from "#application/ports/password-hasher.js"
import type { TokenService } from "#application/ports/token-service.js"
import type { UserRepository } from "#application/ports/user-repository.d.js"
import { BcryptHasher } from "./adapters/bcrypt-hasher.js"
import { CloudinaryAdapter } from "./adapters/cloudinary-adapter.js"
import { DrizzleUserRepository } from "./adapters/drizzle-user-repository.js"
import { JwtService } from "./adapters/jwt-service.js"
import { JWT_SECRET, SALT } from "./config/env.js"

export const userRepo: UserRepository = new DrizzleUserRepository()
export const fileSvc: FileService = new CloudinaryAdapter()
export const hasher: PasswordHasher = new BcryptHasher(SALT)
export const tokenSvc: TokenService = new JwtService(JWT_SECRET)
