import type { TextFieldProps } from "./types"
import { useId } from "react"
import FormField from "~/components/ui/FormField"

export default function UsernameField({ onChange }: TextFieldProps) {
  const id = useId()
  return (
    <FormField>
      <FormField.Label htmlFor={id}>Username</FormField.Label>
      <FormField.Input
        id={id}
        type="text"
        placeholder="Enter your username"
        onChange={(e) => {
          onChange(e.target.value)
        }}
        required
      />
    </FormField>
  )
}
