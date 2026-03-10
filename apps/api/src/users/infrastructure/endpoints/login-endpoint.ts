import { RATE_LIMIT_ENABLED } from "#shared/config/env.js"
import { validator } from "#shared/middlewares/validator.js"
import { loginUseCase } from "#users/infrastructure/dependencies.js"
import { loginHandler } from "#users/infrastructure/handlers/login-handler.js"
import { loginRateLimit } from "#users/infrastructure/middlewares/login-rate-limit.js"
import { loginSchema } from "#users/infrastructure/schemas/login-schema.js"

export const loginEndpoint = [
  validator(loginSchema),
  ...(RATE_LIMIT_ENABLED ? [loginRateLimit] : []),
  loginHandler(loginUseCase),
]
