import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"
import { uploadSignatureHandler } from "#users/infrastructure/handlers/upload-signature-handler.js"

export const uploadSignatureEndpoint = [onlyAuth, uploadSignatureHandler]
