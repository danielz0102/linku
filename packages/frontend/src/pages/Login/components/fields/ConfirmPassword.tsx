import { useId, useRef } from "react"
import FormField from "~/components/ui/FormField"

const NOT_MATCHING_ERROR_MESSAGE = "Passwords do not match"

interface ConfirmPasswordProps {
  onConfirm: (value: string) => boolean
}

export default function ConfirmPassword({ onConfirm }: ConfirmPasswordProps) {
  const password = useRef<string>("")
  const id = useId()
  return (
    <FormField>
      <FormField.Label htmlFor={id}>Confirm Password</FormField.Label>
      <FormField.Input
        id={id}
        type="password"
        placeholder="Confirm your password"
        onChange={(e) => {
          password.current = e.target.value
        }}
        setCustomError={() => {
          if (password.current !== "" && !onConfirm(password.current)) {
            return NOT_MATCHING_ERROR_MESSAGE
          }
          return ""
        }}
        required
      />
    </FormField>
  )
}
