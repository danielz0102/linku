import { Eye, EyeOff, Lock } from "lucide-react"
import { useId, useState } from "react"

type PasswordFieldProps = {
  onChange: (value: string) => void
}

const ERROR_MESSAGE =
  "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long."

export function PasswordField({ onChange }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const id = useId()
  const Icon = isVisible ? EyeOff : Eye

  const passwordIsValid = (password: string) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(password)
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="input-label">
        Password
      </label>
      <div className="relative">
        <Lock className="input-icon" />
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder="••••••••"
          className="input-field pr-12 pl-11"
          required
          onChange={(e) => {
            onChange(e.target.value)
          }}
          onBlur={(e) => {
            const v = passwordIsValid(e.target.value)
            e.target.setCustomValidity(v ? "" : ERROR_MESSAGE)

            if (e.target.checkValidity()) {
              setError(null)
            }
          }}
          onInvalid={(e) => {
            setError(e.currentTarget.validationMessage)
          }}
        />
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
      </div>
      {error && (
        <p className="text-sm text-red-700" role="status">
          {error}
        </p>
      )}
    </div>
  )
}
