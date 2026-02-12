import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import type { ErrorBody } from "api-contract"
import { register } from "../services/register"

type RegistrationFields =
  | "username"
  | "email"
  | "password"
  | "firstName"
  | "lastName"

export type RegistrationErrorBody = ErrorBody<RegistrationFields>

export function useRegisterMutation({ handleApiError }: Options = {}) {
  return useMutation({
    mutationFn: register,
    onError: handleApiError,
  })
}

type Options = {
  handleApiError?: (error: AxiosError<RegistrationErrorBody>) => void
}
