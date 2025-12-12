import type { TextFieldProps } from "./types"
import { useId } from "react"
import FormField from "~/components/ui/FormField"

export default function IdentifierField({ onChange }: TextFieldProps) {
  const id = useId()
  return (
    <FormField>
      <FormField.Label htmlFor={id}>Email / Username</FormField.Label>
      <FormField.Input
        id={id}
        type="text"
        placeholder="Enter your email or username"
        onChange={(e) => {
          onChange(e.target.value)
        }}
        required
      />
    </FormField>
  )
}
