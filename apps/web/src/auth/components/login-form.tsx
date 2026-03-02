import { AtSign, Lock } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import type { ApiError } from "~/shared/api/api-error"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { SubmitButton } from "~/shared/components/submit-button"
import { useAuth } from "../context/auth-context"

type Inputs = {
  username: string
  password: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

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
      const { code, genericMessage } = error as ApiError

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

      <SubmitButton loading={isSubmitting}>Log In</SubmitButton>
    </form>
  )
}
