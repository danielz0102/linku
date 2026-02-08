import { AtSign, Lock, Mail, User } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { Alert } from "~/components/alert"
import { FormField } from "~/components/form-field"
import { useScroll } from "~/hooks/use-scroll"
import { useRegisterMutation } from "../hooks/use-register-mutation"

type Inputs = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export function RegistrationForm() {
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setError,
    getValues,
  } = useForm<Inputs>()

  const password = useWatch({ control, name: "password" })

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

  useScroll({ on: Boolean(errors.root), top: 0 })

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={handleSubmit((data) => {
        const { username, email, password, firstName, lastName } = data
        mutate({
          username,
          email,
          password,
          firstName,
          lastName,
        })
      })}
    >
      {errors.root && <Alert>{errors.root.message}</Alert>}

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
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
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
