import { onlyAuth } from "#shared/auth/only-auth.js"

import { uploadSignatureHandler } from "./upload-signature-handler.js"

export const uploadSignatureEndpoint = [onlyAuth, uploadSignatureHandler]
