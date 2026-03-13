import { SALT } from "#shared/config/env.js"
import { LoginUseCase } from "#users/application/use-cases/login-use-case.js"
import { RegistrationUseCase } from "#users/application/use-cases/registration-use-case.js"
import { UpdateUserUseCase } from "#users/application/use-cases/update-user-use-case.js"
import { BcryptHasher } from "#users/infrastructure/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#users/infrastructure/adapters/drizzle-user-repository.js"

const userRepository = new DrizzleUserRepository()
const passwordHasher = new BcryptHasher(SALT)

export const registrationUseCase = new RegistrationUseCase({
  userRepo: userRepository,
  hasher: passwordHasher,
})

export const loginUseCase = new LoginUseCase({
  userRepo: userRepository,
  hasher: passwordHasher,
})

export const updateUserUseCase = new UpdateUserUseCase(userRepository)

export { userRepository }
