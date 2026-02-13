import { BcryptHasher } from "#modules/users/implementations/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#modules/users/implementations/drizzle-user-repository.js"
import { SALT } from "#shared/config/env.js"
import { rateLimit } from "express-rate-limit"
import { loginHandler } from "./login-handler.js"
import { LoginService } from "./login-service.js"
import { validateLogin } from "./validate-login.js"

const service = new LoginService({
  userRepo: new DrizzleUserRepository(),
  hasher: new BcryptHasher(SALT),
})

const loginRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

export const loginMiddleware = [
  validateLogin,
  loginRateLimit,
  loginHandler(service),
]
