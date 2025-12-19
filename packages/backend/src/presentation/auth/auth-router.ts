import { Router } from "express"
import { RegisterUser } from "~/application/use-cases/register-user.js"
import { BcryptHasher } from "~/infraestructure/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "~/infraestructure/repositories/drizzle-user-repository.js"
import { AuthController } from "./auth-controller.js"

const authRouter = Router()
const registerUser = new RegisterUser(new DrizzleUserRepository(), BcryptHasher)
const controller = new AuthController(registerUser)

authRouter.post("/register", controller.registerUser)

export default authRouter
