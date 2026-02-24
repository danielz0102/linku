import { Router } from "express"
import { getMeEndpoint } from "./endpoints/get-me-endpoint.js"
import { loginEndpoint } from "./endpoints/login-endpoint.js"
import { registerUserEndpoint } from "./endpoints/register-user-endpoint.js"
import { updateUserEndpoint } from "./endpoints/update-user-endpoint.js"
import { logoutHandler } from "./handlers/logout-handler.js"

const router = Router()

router.post("/login", loginEndpoint)
router.post("/logout", logoutHandler)
router.get("/me", getMeEndpoint)
router.post("/", registerUserEndpoint)
router.patch("/", updateUserEndpoint)

export { router as usersRouter }
