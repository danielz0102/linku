import { AtSign, Lock } from "lucide-react"
import { useForm } from "react-hook-form"
import { ApiError } from "~/shared/api/api-error"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { PrimaryButton } from "~/shared/components/primary-button"

type LoginData = {
  username: string
  password: string
}

type LoginFormProps = {
  onSubmit: (data: LoginData) => Promise<void>
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>()

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      if (!ApiError.isApiError(error)) {
        return setError("root", {
          message: new ApiError("UNEXPECTED_ERROR").genericMessage,
        })
      }

      const { code, genericMessage } = error

      setError("root", {
        message:
          code === "UNAUTHORIZED"
            ? "Invalid username or password"
            : genericMessage,
      })
    }
  })

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      {errors.root && <Alert>{errors.root.message}</Alert>}

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
        label="Password"
        Icon={Lock}
        error={errors.password?.message}
      >
        <FormField.PasswordInput
          placeholder="••••••••"
          {...register("password", { required: "Password is required" })}
        />
      </FormField.Root>

      <PrimaryButton type="submit" loading={isSubmitting}>
        Log In
      </PrimaryButton>
    </form>
  )
}
