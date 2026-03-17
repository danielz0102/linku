import { BcryptHasher } from "#api/auth/adapters/bcrypt-hasher.js"
import { Register } from "#core/use-cases/register-use-case.js"
import { SALT } from "#env.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { validator } from "#shared/middlewares/validator.js"

import { registerHandler } from "./register-handler.js"
import { registerSchema } from "./register-schema.js"

export const registerEndpoint = [
  validator(registerSchema),
  registerHandler(
    new Register({
      userRepo: new DrizzleUserRepository(),
      hasher: new BcryptHasher(SALT),
    })
  ),
]
