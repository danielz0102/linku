import { Router } from "express"

import { uploadSignatureEndpoint } from "./endpoints/create-upload-signature/upload-signature-endpoint.js"
import { getUserByIdEndpoint } from "./endpoints/get-user/get-user-by-id-endpoint.js"
import { getUsersEndpoint } from "./endpoints/search-users/search-users-endpoint.js"
import { updateUserEndpoint } from "./endpoints/update-user/update-user-endpoint.js"

export const usersRouter = Router()

usersRouter.post("/upload-signature", uploadSignatureEndpoint)
usersRouter.patch("/", updateUserEndpoint)
usersRouter.get("/", ...getUsersEndpoint)
usersRouter.get("/:id", getUserByIdEndpoint)
