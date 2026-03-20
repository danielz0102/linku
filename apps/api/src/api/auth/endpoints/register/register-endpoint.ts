import { BcryptHasher } from "#api/auth/adapters/bcrypt-hasher.js"
import { Register } from "#core/use-cases/register-use-case.js"
import { SALT } from "#env.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { validator } from "#shared/middlewares/validator.js"

import { registerHandler } from "./register-handler.js"
import { registerSchema } from "./register-schema.js"

export class RegisterEndpoint {
  constructor(private readonly register: Register) {}

  static buildDefault() {
    return new RegisterEndpoint(
      new Register({
        userRepo: new DrizzleUserRepository(),
        hasher: new BcryptHasher(SALT),
      })
    ).build()
  }

  build() {
    return [validator(registerSchema), registerHandler(this.register)]
  }
}
