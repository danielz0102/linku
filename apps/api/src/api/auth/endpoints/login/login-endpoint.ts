import { BcryptHasher } from "#api/auth/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#api/shared/drizzle/drizzle-user-repository.js"
import { validator } from "#api/shared/middlewares/validator.js"
import { LoginUseCase } from "#core/use-cases/login-use-case.js"
import { RATE_LIMIT_ENABLED, SALT } from "#env.js"

import { loginHandler } from "./login-handler.js"
import { loginRateLimit } from "./login-rate-limit.js"
import { loginSchema } from "./login-schema.js"

export const loginEndpoint = [
  validator(loginSchema),
  ...(RATE_LIMIT_ENABLED ? [loginRateLimit] : []),
  loginHandler(
    new LoginUseCase({
      userRepo: new DrizzleUserRepository(),
      hasher: new BcryptHasher(SALT),
    })
  ),
]
