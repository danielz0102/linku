import { AtSign, Lock, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import type { ApiError } from "~/shared/api/api-error"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { SubmitButton } from "~/shared/components/submit-button"
import { useAuth } from "../context/auth-context"

type Inputs = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export function RegistrationForm() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()

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

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      {errors.root && <Alert>{errors.root.message}</Alert>}

      <FormField.Root
        label="First Name"
        Icon={User}
        error={errors.firstName?.message}
      >
        <FormField.Input
          {...register("firstName", { required: "First name is required" })}
          placeholder="John"
        />
      </FormField.Root>

      <FormField.Root
        label="Last Name"
        Icon={User}
        error={errors.lastName?.message}
      >
        <FormField.Input
          {...register("lastName", { required: "Last name is required" })}
          placeholder="Doe"
        />
      </FormField.Root>

      <FormField.Root
        label="Username"
        Icon={AtSign}
        error={errors.username?.message}
      >
        <FormField.Input
          {...register("username", { required: "Username is required" })}
          placeholder="johndoe"
        />
      </FormField.Root>

      <FormField.Root
        label="Email Address"
        Icon={Mail}
        error={errors.email?.message}
      >
        <FormField.Input
          {...register("email", {
            required: "Email address is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "That's not an email!",
            },
          })}
          type="email"
          placeholder="john_doe@example.com"
          autoComplete="true"
        />
      </FormField.Root>

      <FormField.Root
        label="Password"
        Icon={Lock}
        error={errors.password?.message}
      >
        <FormField.PasswordInput
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
              message:
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
            },
          })}
        />
      </FormField.Root>

      <FormField.Root
        label="Confirm Password"
        Icon={Lock}
        error={errors.confirmPassword?.message}
      >
        <FormField.Input
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => {
              if (value !== getValues("password")) {
                return "Passwords do not match"
              }
            },
          })}
        />
      </FormField.Root>

      <SubmitButton loading={isSubmitting}>Create Account</SubmitButton>
    </form>
  )
}
