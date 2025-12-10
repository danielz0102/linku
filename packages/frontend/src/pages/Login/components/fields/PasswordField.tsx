import { useId } from "react"
import FormField from "~/components/ui/FormField"

interface PasswordFieldProps {
  onChange: (value: string) => void
}

export default function PasswordField({ onChange }: PasswordFieldProps) {
  const id = useId()
  return (
    <FormField>
      <FormField.LabelRow>
        <FormField.Label htmlFor={id}>Password</FormField.Label>
        <FormField.Link href="#">Forgot Password?</FormField.Link>
      </FormField.LabelRow>
      <FormField.Input
        id={id}
        type="password"
        placeholder="Enter your password"
        onChange={(e) => {
          onChange(e.target.value)
        }}
        required
      />
    </FormField>
  )
}
