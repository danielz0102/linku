import { Router } from "express"
import { AuthController } from "./auth-controller.js"
import { DrizzleUserRepository } from "~/infraestructure/repositories/drizzle-user-repository.js"

const authRouter = Router()
const controller = new AuthController(new DrizzleUserRepository())

authRouter.post("/register", controller.registerUser)

export default authRouter
