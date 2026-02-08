import { Lock } from "lucide-react"
import type { UseFormRegister } from "react-hook-form"
import { FormField } from "~/components/form-field"

export function PasswordField({ error }: PasswordFieldProps) {
  return (
    <FormField.Provider label="Password" Icon={Lock} error={error}>
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
  )
}

type PasswordFieldProps = {
  error?: string
  // register: UseFormRegister<>
}
