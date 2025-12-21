import { RegisterUser } from "~/application/use-cases/register-user.js"
import { BcryptHasher } from "~/infraestructure/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "~/infraestructure/repositories/drizzle-user-repository.js"
import { AuthController } from "~/presentation/auth/auth-controller.js"
import { createAuthRouter } from "~/presentation/auth/auth-router.js"

const registerUser = new RegisterUser(DrizzleUserRepository, BcryptHasher)
const controller = new AuthController(registerUser)

export default createAuthRouter(controller)
