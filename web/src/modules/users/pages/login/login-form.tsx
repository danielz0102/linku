import { useForm } from "react-hook-form"

import { FormField } from "~/shared/components/form-field"

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void
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
  } = useForm<LoginFormInputs>()

  return (
    <form className="space-y-4" onSubmit={handleSubmit((data) => onSubmit(data.username, data.password))}>
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
