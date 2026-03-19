import { BcryptHasher } from "#api/auth/adapters/bcrypt-hasher.js"
import { Login } from "#core/use-cases/login-use-case.js"
import { RATE_LIMIT_ENABLED, SALT } from "#env.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { validator } from "#shared/middlewares/validator.js"

import { loginHandler } from "./login-handler.js"
import { loginRateLimit } from "./login-rate-limit.js"
import { loginSchema } from "./login-schema.js"

export function createLoginEndpoint(dependencies?: {
  login?: Login
  userRepo?: DrizzleUserRepository
  hasher?: BcryptHasher
}) {
  const userRepo = dependencies?.userRepo ?? new DrizzleUserRepository()
  const hasher = dependencies?.hasher ?? new BcryptHasher(SALT)
  const login =
    dependencies?.login ??
    new Login({
      userRepo,
      hasher,
    })

  return [
    validator(loginSchema),
    ...(RATE_LIMIT_ENABLED ? [loginRateLimit] : []),
    loginHandler(login),
  ]
}

export const loginEndpoint = createLoginEndpoint()
