import { onlyAuth } from "#api/shared/middlewares/only-auth.js"

import { uploadSignatureHandler } from "./upload-signature-handler.js"

export const uploadSignatureEndpoint = [onlyAuth, uploadSignatureHandler]
