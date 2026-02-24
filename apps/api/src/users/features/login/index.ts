import { RATE_LIMIT_ENABLED, SALT } from "#shared/config/env.js"
import { validator } from "#shared/middlewares/validator.js"
import { BcryptHasher } from "#users/implementations/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#users/implementations/drizzle-user-repository.js"
import { loginHandler } from "./login-handler.js"
import { loginRateLimit } from "./login-rate-limit.js"
import { LoginService } from "./login-service.js"
import { loginSchema } from "./login-schema.js"

const service = new LoginService({
  userRepo: new DrizzleUserRepository(),
  hasher: new BcryptHasher(SALT),
})

export const loginMiddleware = [
  validator(loginSchema),
  ...(RATE_LIMIT_ENABLED ? [loginRateLimit] : []),
  loginHandler(service),
]
