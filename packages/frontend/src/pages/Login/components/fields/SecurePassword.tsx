import type { TextFieldProps } from "./types"
import { useId } from "react"
import FormField from "~/components/ui/FormField"

const PASSWORD_PATTERN =
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"

const PASSWORD_ERROR_MESSAGE =
  "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"

export default function SecurePassword({ onChange }: TextFieldProps) {
  const id = useId()

  return (
    <FormField>
      <FormField.Label htmlFor={id}>Password</FormField.Label>
      <FormField.Input
        id={id}
        type="password"
        placeholder="Enter your password"
        onChange={(e) => {
          onChange(e.target.value)
        }}
        pattern={PASSWORD_PATTERN}
        setCustomError={(validity) => {
          if (validity.patternMismatch) {
            return PASSWORD_ERROR_MESSAGE
          }
          return ""
        }}
        required
      />
    </FormField>
  )
}
