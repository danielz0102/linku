import { BcryptHasher } from "#api/auth/adapters/bcrypt-hasher.js"
import { Register } from "#core/use-cases/register-use-case.js"
import { SALT } from "#env.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { validator } from "#shared/middlewares/validator.js"

import { registerHandler } from "./register-handler.js"
import { registerSchema } from "./register-schema.js"

export function createRegisterEndpoint(dependencies?: {
  register?: Register
  userRepo?: DrizzleUserRepository
  hasher?: BcryptHasher
}) {
  const userRepo = dependencies?.userRepo ?? new DrizzleUserRepository()
  const hasher = dependencies?.hasher ?? new BcryptHasher(SALT)
  const register =
    dependencies?.register ??
    new Register({
      userRepo,
      hasher,
    })

  return [validator(registerSchema), registerHandler(register)]
}

export const registerEndpoint = createRegisterEndpoint()
