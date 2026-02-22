import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import type { ApiError } from "~/shared/api/api-error"
import { useAuth } from "../context/auth-context"

type Inputs = {
  username: string
  password: string
}

export function useLoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const fields = {
    username: register("username", { required: "Username is required" }),
    password: register("password", { required: "Password is required" }),
  }

  const submit = handleSubmit(async (data) => {
    try {
      await login(data)
      navigate("/")
    } catch (error) {
      const { code, genericMessage } = error as ApiError

      setError("root", {
        message:
          code === "UNAUTHORIZED"
            ? "Invalid username or password"
            : genericMessage,
      })
    }
  })

  return {
    submit,
    isLoading: isSubmitting,
    fields,
    errors,
  }
}
