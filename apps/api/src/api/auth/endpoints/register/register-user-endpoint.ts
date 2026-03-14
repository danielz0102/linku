import { BcryptHasher } from "#api/auth/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#api/shared/drizzle/drizzle-user-repository.js"
import { validator } from "#api/shared/middlewares/validator.js"
import { RegistrationUseCase } from "#core/use-cases/registration-use-case.js"
import { SALT } from "#env.js"

import { registrationHandler } from "./registration-handler.js"
import { registrationSchema } from "./registration-schema.js"

export const registerUserEndpoint = [
  validator(registrationSchema),
  registrationHandler(
    new RegistrationUseCase({
      userRepo: new DrizzleUserRepository(),
      hasher: new BcryptHasher(SALT),
    })
  ),
]
