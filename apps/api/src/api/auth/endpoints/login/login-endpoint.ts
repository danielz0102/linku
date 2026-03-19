import { BcryptHasher } from "#api/auth/adapters/bcrypt-hasher.js"
import { Login } from "#core/use-cases/login-use-case.js"
import { RATE_LIMIT_ENABLED, SALT } from "#env.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { validator } from "#shared/middlewares/validator.js"

import { loginHandler } from "./login-handler.js"
import { loginRateLimit } from "./login-rate-limit.js"
import { loginSchema } from "./login-schema.js"

export const loginEndpoint = [
  validator(loginSchema),
  ...(RATE_LIMIT_ENABLED ? [loginRateLimit] : []),
  loginHandler(
    new Login({
      userRepo: new DrizzleUserRepository(),
      hasher: new BcryptHasher(SALT),
    })
  ),
]

export function createLoginEndpoint(login: Login) {
  return [
    validator(loginSchema),
    ...(RATE_LIMIT_ENABLED ? [loginRateLimit] : []),
    loginHandler(login),
  ]
}
