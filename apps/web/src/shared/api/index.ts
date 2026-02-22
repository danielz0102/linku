import type { ErrorBody } from "@linku/api-contract"
import axios, { type AxiosError } from "axios"
import { z } from "zod/mini"
import { API_URL } from "~/shared/config/env"
import { ApiError } from "./api-error"

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      throw new ApiError({ code: "NETWORK_ERROR" })
    }

    const { data } = error.response

    if (!isErrorBody(data)) {
      throw new ApiError({ code: "UNEXPECTED_ERROR" })
    }

    const { code, errors } = data

    throw new ApiError({ code, errors })
  }
)

function isErrorBody(data: unknown): data is ErrorBody {
  return errorBodySchema.safeParse(data).success
}

const errorBodySchema = z.object({
  code: z.string(),
  message: z.string(),
  errors: z.optional(z.record(z.string(), z.string())),
})
