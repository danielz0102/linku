import axios from "axios"
import { AtSign, Lock, Mail, User } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { useScroll } from "~/hooks/use-scroll"
import { useRegister } from "~/hooks/useRegister"
import type { ValidationErrorData } from "~/types"
import { Alert } from "./alert"
import { FormField } from "./form-field"
import { ImagePicker } from "./image-picker"

type Inputs = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  file: File | null
}

export function RegistrationForm() {
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<Inputs>({ defaultValues: { file: null } })

  const password = useWatch({ control, name: "password" })

  register("file")

  const { isPending, isError, error } = useRegister()

  useScroll({ on: isError, top: 0 })

  const mapError = (error: Error): string => {
    if (!axios.isAxiosError(error)) {
      return "An unexpected error occurred. Please try again."
    }

    if (error.response?.status === 409) {
      return "Username or email already exists. Please choose another."
    }

    if (error.response?.status === 400) {
      const data = error.response.data as ValidationErrorData
      const messages = Object.values(data.errors).flat()
      return messages[0]
    }

    return "An unexpected error occurred. Please try again."
  }

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={handleSubmit((data) => {
        console.log({ data })
      })}
    >
      {isError && <Alert>{mapError(error)}</Alert>}

      <ImagePicker onChange={(file) => setValue("file", file)} />

      <FormField.Provider
        label="First Name"
        Icon={User}
        error={errors.firstName?.message}
      >
        <FormField.Input
          {...register("firstName", { required: "First name is required" })}
          placeholder="John"
        />
      </FormField.Provider>

      <FormField.Provider
        label="Last Name"
        Icon={User}
        error={errors.lastName?.message}
      >
        <FormField.Input
          {...register("lastName", { required: "Last name is required" })}
          placeholder="Doe"
        />
      </FormField.Provider>

      <FormField.Provider
        label="Username"
        Icon={AtSign}
        error={errors.username?.message}
      >
        <FormField.Input
          {...register("username", { required: "Username is required" })}
          placeholder="johndoe"
        />
      </FormField.Provider>

      <FormField.Provider
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
        />
      </FormField.Provider>

      <FormField.Provider
        label="Password"
        Icon={Lock}
        error={errors.password?.message}
      >
        <FormField.PasswordInput
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
              message:
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
            },
          })}
        />
      </FormField.Provider>

      <FormField.Provider
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
              if (value !== password) {
                return "Passwords do not match"
              }
            },
          })}
        />
      </FormField.Provider>

      <button
        type="submit"
        disabled={isPending}
        className="w-full cursor-pointer rounded-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950 focus:outline-none"
      >
        {isPending ? "Loading..." : "Create Account"}
      </button>
    </form>
  )
}
