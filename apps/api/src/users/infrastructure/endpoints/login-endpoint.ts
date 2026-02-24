import { RATE_LIMIT_ENABLED, SALT } from "#shared/config/env.js"
import { validator } from "#shared/middlewares/validator.js"
import { LoginUseCase } from "#users/application/use-cases/login-use-case.js"
import { BcryptHasher } from "#users/infrastructure/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#users/infrastructure/adapters/drizzle-user-repository.js"
import { loginHandler } from "#users/infrastructure/handlers/login-handler.js"
import { loginRateLimit } from "#users/infrastructure/middlewares/login-rate-limit.js"
import { loginSchema } from "#users/infrastructure/schemas/login-schema.js"

const service = new LoginUseCase({
  userRepo: new DrizzleUserRepository(),
  hasher: new BcryptHasher(SALT),
})

export const loginEndpoint = [
  validator(loginSchema),
  ...(RATE_LIMIT_ENABLED ? [loginRateLimit] : []),
  loginHandler(service),
]
