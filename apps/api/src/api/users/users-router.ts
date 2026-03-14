import { getMeEndpoint } from "#api/auth/endpoints/get-authenticated-user/get-me-endpoint.js"
import { logoutHandler } from "#api/auth/endpoints/log-out/logout-handler.js"
import { loginEndpoint } from "#api/auth/endpoints/login/login-endpoint.js"
import { registerUserEndpoint } from "#api/auth/endpoints/register/register-user-endpoint.js"
import { Router } from "express"

import { uploadSignatureEndpoint } from "./endpoints/create-upload-signature/upload-signature-endpoint.js"
import { getUserByIdEndpoint } from "./endpoints/get-user/get-user-by-id-endpoint.js"
import { getUsersEndpoint } from "./endpoints/search-users/search-users-endpoint.js"
import { updateUserEndpoint } from "./endpoints/update-user/update-user-endpoint.js"

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
