import { Router } from "express"

import { getMeEndpoint } from "./endpoints/get-authenticated-user/get-me-endpoint.js"
import { logoutHandler } from "./endpoints/log-out/logout-handler.js"
import { loginEndpoint } from "./endpoints/login/login-endpoint.js"
import { registerUserEndpoint } from "./endpoints/register/register-user-endpoint.js"

export const authRouter = Router()

authRouter.post("/login", loginEndpoint)
authRouter.post("/register", registerUserEndpoint)
authRouter.post("/logout", logoutHandler)
authRouter.get("/me", getMeEndpoint)
