import { BcryptHasher } from "#users/implementations/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#users/implementations/drizzle-user-repository.js"
import { RATE_LIMIT_ENABLED, SALT } from "#shared/config/env.js"
import { loginHandler } from "./login-handler.js"
import { loginRateLimit } from "./login-rate-limit.js"
import { LoginService } from "./login-service.js"
import { validateLogin } from "./validate-login.js"

const service = new LoginService({
  userRepo: new DrizzleUserRepository(),
  hasher: new BcryptHasher(SALT),
})

export const loginMiddleware = [
  validateLogin,
  ...(RATE_LIMIT_ENABLED ? [loginRateLimit] : []),
  loginHandler(service),
]
