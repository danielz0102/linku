import { BcryptHasher } from "#modules/users/implementations/bcrypt-hasher.js"
import { DrizzleUserRepository } from "#modules/users/implementations/drizzle-user-repository.js"
import { SALT } from "#shared/config/env.js"
import { loginHandler } from "./login-handler.js"
import { LoginService } from "./login-service.js"
import { validateLogin } from "./validate-login.js"

const service = new LoginService({
  userRepo: new DrizzleUserRepository(),
  hasher: new BcryptHasher(SALT),
})

export const loginMiddleware = [validateLogin, loginHandler(service)]
