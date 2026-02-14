import { useForm } from "react-hook-form"
import type { AxiosError } from "axios"
import type { LoginErrorBody } from "api-contract"
import { errorMatcher } from "~/shared/api/error-matcher"
import { useNavigate } from "react-router"
import { login } from "../services/login"

export function useLoginForm() {
  const navigate = useNavigate()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const submit = handleSubmit(async (data) => {
    try {
      await login(data)
      navigate("/")
    } catch (error) {
      handleApiError(error as AxiosError<LoginErrorBody>)
    }
  })

  function handleApiError(error: AxiosError<LoginErrorBody>) {
    if (!error.response) {
      return setError("root", {
        message: errorMatcher("NETWORK_ERROR"),
      })
    }

    const { status, data } = error.response

    if (status === 401) {
      return setError("root", { message: "Credentials are invalid" })
    }

    if (status === 429) {
      return setError("root", {
        message: "Too many login attempts. Please try again later.",
      })
    }

    const { code } = data

    return setError("root", {
      message: errorMatcher(code),
    })
  }

  const fields = {
    username: register("username", { required: "Username is required" }),
    password: register("password", { required: "Password is required" }),
  }

  return {
    submit,
    isLoading: isSubmitting,
    fields,
    errors,
  }
}

type Inputs = {
  username: string
  password: string
}
