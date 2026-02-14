import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import type { ApiError } from "~/shared/api/api-error"
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
      handleApiError(error as ApiError)
    }
  })

  function handleApiError(error: ApiError) {
    if (error.code === "UNAUTHORIZED") {
      return setError("root", {
        message: "Invalid username or password",
      })
    }

    setError("root", {
      message: error.genericMessage,
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
