import { getMeEndpoint } from "#api/auth/features/get-authenticated-user/get-me-endpoint.js"
import { logoutHandler } from "#api/auth/features/log-out/logout-handler.js"
import { loginEndpoint } from "#api/auth/features/login/login-endpoint.js"
import { registerUserEndpoint } from "#api/auth/features/register/register-user-endpoint.js"
import { Router } from "express"

import { uploadSignatureEndpoint } from "./features/create-upload-signature/upload-signature-endpoint.js"
import { getUserByIdEndpoint } from "./features/get-user/get-user-by-id-endpoint.js"
import { getUsersEndpoint } from "./features/search-users/search-users-endpoint.js"
import { updateUserEndpoint } from "./features/update-user/update-user-endpoint.js"

const router = Router()

router.post("/login", loginEndpoint)
router.post("/logout", logoutHandler)
router.get("/me", getMeEndpoint)
router.post("/upload-signature", uploadSignatureEndpoint)
router.post("/", registerUserEndpoint)
router.patch("/", updateUserEndpoint)
router.get("/", ...getUsersEndpoint)
router.get("/:id", getUserByIdEndpoint)

export { router as usersRouter }
