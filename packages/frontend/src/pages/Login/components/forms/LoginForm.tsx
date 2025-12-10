import { useRef } from "react"
import Button from "~/components/ui/Button"
import IdentifierField from "../fields/IdentifierField"
import PasswordField from "../fields/PasswordField"

interface LoginFormData {
  identifier: string
  password: string
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const data = useRef<LoginFormData>({ identifier: "", password: "" })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(data.current)
      }}
      className="flex flex-col gap-4"
    >
      <IdentifierField
        onChange={(value) => {
          data.current.identifier = value
        }}
      />
      <PasswordField
        onChange={(value) => {
          data.current.password = value
        }}
      />
      <Button type="submit" className="mt-2 w-full">
        Log In
      </Button>
    </form>
  )
}
