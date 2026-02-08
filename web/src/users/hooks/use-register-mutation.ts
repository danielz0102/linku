import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { isApiErrorData, type ApiErrorData } from "~/api/api-error-data"
import { register } from "../services/register"

export function useRegisterMutation({
  handleExternalError,
  handleApiError,
}: Options = {}) {
  return useMutation({
    mutationFn: register,
    onError: (error) => {
      if (handleExternalError) {
        const externalError = getExternalError(error)

        if (externalError) {
          return handleExternalError(externalError)
        }
      }

      if (handleApiError) {
        const apiErrorData = getApiErrorData(error)

        if (apiErrorData) {
          return handleApiError(apiErrorData)
        }
      }
    },
  })
}

type Options = {
  handleExternalError?: (error: string) => void
  handleApiError?: (data: ApiErrorData) => void
}

function getExternalError(error: Error): string | undefined {
  if (!axios.isAxiosError(error)) {
    return "An unexpected error occurred. Please try again later."
  }

  if (!error.response) {
    return "A network error occurred. Please check your connection and try again."
  }

  const { data } = error.response

  if (!isApiErrorData(data)) {
    return "An unexpected error occurred. Please try again later."
  }
}

function getApiErrorData(error: Error): ApiErrorData | undefined {
  if (!axios.isAxiosError(error)) {
    return
  }

  const data = error.response?.data

  if (isApiErrorData(data)) {
    return data
  }
}
