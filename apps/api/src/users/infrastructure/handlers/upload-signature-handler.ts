import { createUploadSignature } from "#shared/providers/upload-image.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

export const uploadSignatureHandler: RequestHandler<
  never,
  LinkuAPI.UploadSignature["ResponseBody"]
> = (_req, res) => {
  return res.status(200).json(createUploadSignature())
}
