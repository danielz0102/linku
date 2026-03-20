import { Login } from "#core/use-cases/login-use-case.js"
import { RATE_LIMIT_ENABLED, SALT } from "#env.js"
import { BcryptHasher } from "#shared/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { validator } from "#shared/validation/validator.js"

import { loginHandler } from "./login-handler.js"
import { loginRateLimit } from "./login-rate-limit.js"
import { loginSchema } from "./login-schema.js"

export class LoginEndpoint {
  constructor(private login: Login) {}

  static buildDefault() {
    return new LoginEndpoint(
      new Login({
        userRepo: new DrizzleUserRepository(),
        hasher: new BcryptHasher(SALT),
      })
    ).build(RATE_LIMIT_ENABLED)
  }

  build(withRateLimit: boolean) {
    return [
      validator(loginSchema),
      ...(withRateLimit ? [loginRateLimit] : []),
      loginHandler(this.login),
    ]
  }
}
