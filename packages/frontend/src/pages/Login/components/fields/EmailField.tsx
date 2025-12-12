import type { TextFieldProps } from "./types"
import { useId } from "react"
import FormField from "~/components/ui/FormField"

export default function EmailField({ onChange }: TextFieldProps) {
  const id = useId()
  return (
    <FormField>
      <FormField.Label htmlFor={id}>Email</FormField.Label>
      <FormField.Input
        id={id}
        type="email"
        placeholder="Enter your email"
        onChange={(e) => {
          onChange(e.target.value)
        }}
        required
      />
    </FormField>
  )
}
