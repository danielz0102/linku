import { uploadSignatureHandler } from "#users/infrastructure/handlers/upload-signature-handler.js"
import { onlyAuth } from "#users/infrastructure/middlewares/only-auth.js"

export const uploadSignatureEndpoint = [onlyAuth, uploadSignatureHandler]
