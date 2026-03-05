import type { LinkuAPI } from "@linku/api-contract"
import { apiClient } from "~/shared/api"

export async function getUploadSignature(): Promise<
  LinkuAPI.UploadSignature["ResponseBody"]
> {
  return apiClient
    .post<LinkuAPI.UploadSignature["ResponseBody"]>("/users/upload-signature")
    .then(({ data }) => data)
}
