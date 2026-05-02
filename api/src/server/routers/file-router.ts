import { Router } from "express"

import { createSignatureHTTPController } from "#modules/files/commands/create-signature-http-controller.ts"

export const fileRouter = Router()

fileRouter.post("/sign", createSignatureHTTPController)
