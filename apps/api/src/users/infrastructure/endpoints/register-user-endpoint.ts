import { SALT } from "#shared/config/env.js"
import { validator } from "#shared/middlewares/validator.js"
import { RegistrationUseCase } from "#users/application/use-cases/registration-use-case.js"
import { BcryptHasher } from "#users/infrastructure/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#users/infrastructure/adapters/drizzle-user-repository.js"
import { registrationHandler } from "#users/infrastructure/handlers/registration-handler.js"
import { registrationSchema } from "#users/infrastructure/schemas/registration-schema.js"

const service = new RegistrationUseCase({
  userRepo: new DrizzleUserRepository(),
  hasher: new BcryptHasher(SALT),
})

export const registerUserEndpoint = [
  validator(registrationSchema),
  registrationHandler(service),
]
