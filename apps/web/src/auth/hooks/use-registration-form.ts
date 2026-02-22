import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import type { ApiError } from "~/shared/api/api-error"
import { useAuth } from "../context/auth-context"

type Inputs = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export function useRegistrationForm() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()

  const {
    register,
    setError,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const fields = {
    username: register("username", { required: "Username is required" }),
    email: register("email", {
      required: "Email address is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "That's not an email!",
      },
    }),
    lastName: register("lastName", { required: "Last name is required" }),
    firstName: register("firstName", {
      required: "First name is required",
    }),
    password: register("password", {
      required: "Password is required",
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      },
    }),
    confirmPassword: register("confirmPassword", {
      required: "Please confirm your password",
      validate: (value) => {
        if (value !== getValues("password")) {
          return "Passwords do not match"
        }
      },
    }),
  }

  const submit = handleSubmit(async (data) => {
    const { username, email, password, firstName, lastName } = data

    try {
      await registerUser({
        username,
        email,
        password,
        firstName,
        lastName,
      })

      navigate("/")
    } catch (error) {
      const apiError = error as ApiError

      if (apiError.code !== "VALIDATION_ERROR") {
        return setError("root", {
          message: apiError.genericMessage,
        })
      }

      const fieldKeys = Object.keys(getValues()) as (keyof Inputs)[]

      fieldKeys.forEach((k) => {
        const message = apiError.getValidationError(k)

        if (message) {
          setError(k, { message }, { shouldFocus: true })
        }
      })
    }
  })

  return { submit, isLoading: isSubmitting, fields, errors }
}
