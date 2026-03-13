import { AtSign, Lock, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form"

import { ApiError } from "~/shared/api/api-error"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { PrimaryButton } from "~/shared/components/primary-button"

type RegistrationData = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

type RegistrationFormFields = RegistrationData & { confirmPassword: string }

type RegistrationFormProps = {
  onSubmit: (data: RegistrationData) => Promise<void>
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const {
    register,
    setError,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormFields>()

  const submit = handleSubmit(async (data) => {
    const { confirmPassword: _, ...fields } = data

    try {
      await onSubmit(fields)
    } catch (error) {
      if (!ApiError.isApiError(error)) {
        return setError("root", {
          message: new ApiError("UNEXPECTED_ERROR").genericMessage,
        })
      }

      if (error.code !== "VALIDATION_ERROR") {
        return setError("root", {
          message: error.genericMessage,
        })
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const fieldKeys = Object.keys(getValues()) as (keyof RegistrationFormFields)[]

      fieldKeys.forEach((k) => {
        const message = error.getValidationError(k)

        if (message) {
          setError(k, { message }, { shouldFocus: true })
        }
      })
    }
  })

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      {errors.root && <Alert>{errors.root.message}</Alert>}

      <FormField.Root label="First Name" Icon={User} error={errors.firstName?.message}>
        <FormField.Input
          {...register("firstName", { required: "First name is required" })}
          placeholder="John"
        />
      </FormField.Root>

      <FormField.Root label="Last Name" Icon={User} error={errors.lastName?.message}>
        <FormField.Input
          {...register("lastName", { required: "Last name is required" })}
          placeholder="Doe"
        />
      </FormField.Root>

      <FormField.Root label="Username" Icon={AtSign} error={errors.username?.message}>
        <FormField.Input
          {...register("username", { required: "Username is required" })}
          placeholder="johndoe"
        />
      </FormField.Root>

      <FormField.Root label="Email Address" Icon={Mail} error={errors.email?.message}>
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

      <FormField.Root label="Password" Icon={Lock} error={errors.password?.message}>
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

      <FormField.Root label="Confirm Password" Icon={Lock} error={errors.confirmPassword?.message}>
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

      <PrimaryButton type="submit" loading={isSubmitting}>
        Create Account
      </PrimaryButton>
    </form>
  )
}
