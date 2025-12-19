import { Router } from "express"
import { RegisterUser } from "~/application/use-cases/register-user.js"
import { BcryptHasher } from "~/infraestructure/adapters/bcrypt-hasher.js"
import { DrizzleUserRepository } from "~/infraestructure/repositories/drizzle-user-repository.js"
import { validate } from "../middlewares/validate.js"
import { AuthController } from "./auth-controller.js"
import { registerUserSchema } from "./schemas/register-user-schema.js"

const authRouter = Router()
const registerUser = new RegisterUser(DrizzleUserRepository, BcryptHasher)
const controller = new AuthController(registerUser)

authRouter.post(
  "/register",
  validate(registerUserSchema),
  controller.registerUser
)

export default authRouter
