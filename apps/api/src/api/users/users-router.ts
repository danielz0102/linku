import { Router } from "express"

import { uploadSignatureEndpoint } from "./endpoints/create-upload-signature/upload-signature-endpoint.js"
import { GetUserByIdEndpoint } from "./endpoints/get-user/get-user-by-id-endpoint.js"
import { SearchUsersEndpoint } from "./endpoints/search-users/search-users-endpoint.js"
import { UpdateUserEndpoint } from "./endpoints/update-user/update-user-endpoint.js"

export const usersRouter = Router()

usersRouter.post("/upload-signature", uploadSignatureEndpoint)
usersRouter.patch("/", UpdateUserEndpoint.buildDefault())
usersRouter.get("/", SearchUsersEndpoint.buildDefault())
usersRouter.get("/:id", GetUserByIdEndpoint.buildDefault())
