import { Router } from "express"

import { getMeEndpoint } from "./endpoints/get-authenticated-user/get-me-endpoint.js"
import { logOutHandler } from "./endpoints/log-out/log-out-handler.js"
import { LoginEndpoint } from "./endpoints/login/login-endpoint.js"
import { registerEndpoint } from "./endpoints/register/register-endpoint.js"

export const authRouter = Router()

authRouter.post("/login", LoginEndpoint.buildDefault())
authRouter.post("/register", registerEndpoint)
authRouter.post("/logout", logOutHandler)
authRouter.get("/me", getMeEndpoint)
