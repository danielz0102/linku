import type { TextFieldProps } from "./types"
import { useId } from "react"
import FormField from "~/components/ui/FormField"

export default function PasswordField({ onChange }: TextFieldProps) {
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
