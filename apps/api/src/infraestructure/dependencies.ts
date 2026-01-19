import { BcryptHasher } from "./adapters/bcrypt-hasher.js"
import { CloudinaryAdapter } from "./adapters/cloudinary-adapter.js"
import { DrizzleUserRepository } from "./adapters/drizzle-user-repository.js"
import { JwtService } from "./adapters/jwt-service.js"
import { JWT_SECRET, SALT } from "./config/env.js"

export const userRepository = new DrizzleUserRepository()
export const fileService = new CloudinaryAdapter()
export const passwordHasher = new BcryptHasher(SALT)
export const tokenService = new JwtService(JWT_SECRET)
