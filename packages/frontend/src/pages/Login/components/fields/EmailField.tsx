import { useId } from "react"
import FormField from "~/components/ui/FormField"

interface EmailFieldProps {
  onChange: (value: string) => void
}

export default function EmailField({ onChange }: EmailFieldProps) {
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
