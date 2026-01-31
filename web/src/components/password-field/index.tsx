import { Eye, EyeOff, Lock } from "lucide-react"
import { useState } from "react"
import { FormField } from "../form-field"

type PasswordFieldProps = {
  onChange: (value: string) => void
}

const ERROR_MESSAGE =
  "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long."

export function PasswordField({ onChange }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = isVisible ? EyeOff : Eye

  const passwordIsValid = (password: string) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(password)
  }

  return (
    <FormField
      label="Password"
      Icon={Lock}
      validate={(v) => {
        if (!passwordIsValid(v)) {
          return ERROR_MESSAGE
        }
      }}
      attrs={{
        type: isVisible ? "text" : "password",
        placeholder: "••••••••",
        required: true,
        onChange: (e) => onChange(e.target.value),
      }}
    >
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-400"
        onClick={() => setIsVisible((prev) => !prev)}
      >
        <Icon
          className="size-5"
          aria-label={isVisible ? "Hide password" : "Show password"}
        />
      </button>
    </FormField>
  )
}
