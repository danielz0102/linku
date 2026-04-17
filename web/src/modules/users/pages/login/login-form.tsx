import { IconAlertTriangle } from "@tabler/icons-react"
import { useForm } from "react-hook-form"

import { FormField } from "~/shared/components/form-field"

interface LoginFormProps {
  onSubmit: (data: { username: string; password: string }) => Promise<boolean>
}

type LoginFormInputs = {
  username: string
  password: string
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>()

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (data) => {
        const success = await onSubmit(data)

        if (!success) {
          setError("root", { message: "Invalid credentials" })
        }
      })}
    >
      <div
        role="alert"
        hidden={!errors.root}
        className="flex items-center justify-center gap-2 rounded bg-red-300 py-1 text-red-700"
      >
        {errors.root && (
          <>
            <IconAlertTriangle size={20} strokeWidth={1.5} />
            {errors.root.message}
          </>
        )}
      </div>

      <FormField label="Username" error={errors.username?.message}>
        {(props) => (
          <input
            {...register("username", { required: "Username is required" })}
            {...props}
            placeholder="john_doe"
            className="input"
            autoComplete="username"
          />
        )}
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        {(props) => (
          <input
            {...register("password", { required: "Password is required" })}
            {...props}
            type="password"
            placeholder="••••••••"
            className="input"
            autoComplete="current-password"
          />
        )}
      </FormField>

      <button type="submit" className="button mt-4 w-full">
        Login
      </button>
    </form>
  )
}
