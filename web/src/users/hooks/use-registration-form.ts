import { useForm } from "react-hook-form"
import { useRegisterMutation } from "./use-register-mutation"

export function useRegistrationForm() {
  const {
    register,
    setError,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const { mutate, isPending } = useRegisterMutation({
    handleExternalError: (error) => {
      setError("root", { message: error })
    },
    handleApiError: (data) => {
      const { errors } = data

      if (!errors.some(({ field }) => isInput(field))) {
        return setError("root", {
          message: "An unexpected error occurred. Please try again later.",
        })
      }

      errors.forEach(({ field, details }) => {
        if (isInput(field)) {
          setError(field, { message: details }, { shouldFocus: true })
        }
      })

      function isInput(field: string): field is keyof Inputs {
        const inputs = Object.keys(getValues())
        return inputs.includes(field)
      }
    },
  })

  const submit = handleSubmit((data) => {
    const { username, email, password, firstName, lastName } = data
    mutate({
      username,
      email,
      password,
      firstName,
      lastName,
    })
  })

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

  return { submit, isLoading: isPending, fields, errors }
}

type Inputs = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}
