import { SALT } from "#config/env.js"
import { DrizzleUserRepository } from "#users/implementations/drizzle-user-repository.js"
import bcrypt from "bcryptjs"
import { RegistrationHandler } from "./registration-handler.js"
import { RegistrationService } from "./registration-service.js"
import { validateRegistration } from "./validate-registration.js"

const service = new RegistrationService({
  userRepo: new DrizzleUserRepository(),
  hashPassword: async (password) => {
    return bcrypt.hash(password, SALT)
  },
})

const handler = new RegistrationHandler(service)

export const registrationMiddleware = [validateRegistration, handler.handle]
