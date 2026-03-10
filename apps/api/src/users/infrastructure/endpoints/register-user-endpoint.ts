import { validator } from "#shared/middlewares/validator.js"
import { registrationUseCase } from "#users/infrastructure/dependencies.js"
import { registrationHandler } from "#users/infrastructure/handlers/registration-handler.js"
import { registrationSchema } from "#users/infrastructure/schemas/registration-schema.js"

export const registerUserEndpoint = [
  validator(registrationSchema),
  registrationHandler(registrationUseCase),
]
