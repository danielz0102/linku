import { useForm } from "react-hook-form"

import { FormField } from "~/shared/components/form-field"

type SignUpFormProps = {
  onSubmit: (data: {
    firstName: string
    lastName: string
    username: string
    password: string
  }) => void
}

type SignUpInputs = {
  firstName: string
  lastName: string
  username: string
  password: string
  confirmPassword: string
}

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>()

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((data) => {
        onSubmit({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          password: data.password,
        })
      })}
    >
      <FormField label="First Name" error={errors.firstName?.message}>
        {(props) => (
          <input
            {...register("firstName", { required: "First name is required" })}
            {...props}
            placeholder="John"
            className="input"
            autoComplete="name"
          />
        )}
      </FormField>

      <FormField label="Last Name" error={errors.lastName?.message}>
        {(props) => (
          <input
            {...register("lastName", { required: "Last name is required" })}
            {...props}
            placeholder="Doe"
            className="input"
          />
        )}
      </FormField>

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
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[^\w\s]).+$/,
                message: "Password must contain at least one special character",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            {...props}
            type="password"
            placeholder="••••••••"
            className="input"
          />
        )}
      </FormField>

      <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
        {(props) => (
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value, { password }) => {
                if (value !== password) {
                  return "Passwords do not match"
                }
              },
            })}
            {...props}
            type="password"
            placeholder="••••••••"
            className="input"
          />
        )}
      </FormField>

      <button type="submit" className="button w-full">
        Sign up
      </button>
    </form>
  )
}
