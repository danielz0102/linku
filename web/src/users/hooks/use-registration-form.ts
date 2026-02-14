import { useForm } from "react-hook-form"
import type { AxiosError } from "axios"
import type { RegistrationErrorBody } from "api-contract"
import { errorMatcher } from "~/shared/api/error-matcher"
import { register as registerUser } from "../services/register"

export function useRegistrationForm() {
  const {
    register,
    setError,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

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
    } catch (error) {
      handleApiError(error as AxiosError<RegistrationErrorBody>)
    }
  })

  function handleApiError(error: AxiosError<RegistrationErrorBody>) {
    if (!error.response) {
      return setError("root", {
        message: errorMatcher("NETWORK_ERROR"),
      })
    }

    const { data } = error.response
    const { code, errors } = data

    if (code !== "VALIDATION_ERROR") {
      return setRootError(code)
    }

    if (!errors) {
      return setRootError("UNEXPECTED_ERROR")
    }

    const formErrors = Object.entries(errors).filter(areFormErrors)

    if (formErrors.length === 0) {
      return setRootError("UNEXPECTED_ERROR")
    }

    formErrors.forEach(([field, message]) => {
      setError(field, { message }, { shouldFocus: true })
    })

    function areFormErrors(
      entry: [string, string]
    ): entry is [keyof Inputs, string] {
      const [field] = entry
      return field in getValues()
    }
  }

  function setRootError(code: Parameters<typeof errorMatcher>[0]) {
    setError("root", { message: errorMatcher(code) })
  }

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

  return { submit, isLoading: isSubmitting, fields, errors }
}

type Inputs = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}
