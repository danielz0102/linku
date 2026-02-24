import { SALT } from "#shared/config/env.js"
import { validator } from "#shared/middlewares/validator.js"
import { BcryptHasher } from "#users/implementations/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#users/implementations/drizzle-user-repository.js"
import { registrationHandler } from "./registration-handler.js"
import { RegistrationService } from "./registration-service.js"
import { registrationSchema } from "./registration-schema.js"

const service = new RegistrationService({
  userRepo: new DrizzleUserRepository(),
  hasher: new BcryptHasher(SALT),
})

export const registrationMiddleware = [
  validator(registrationSchema),
  registrationHandler(service),
]
