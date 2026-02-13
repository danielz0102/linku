import { BcryptHasher } from "#modules/users/implementations/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#modules/users/implementations/drizzle-user-repository.js"
import { SALT } from "#shared/config/env.js"
import { RegistrationHandler } from "./registration-handler.js"
import { RegistrationService } from "./registration-service.js"
import { validateRegistration } from "./validate-registration.js"

const service = new RegistrationService({
  userRepo: new DrizzleUserRepository(),
  hasher: new BcryptHasher(SALT),
})

const handler = new RegistrationHandler(service)

export const registrationMiddleware = [validateRegistration, handler.handle]
